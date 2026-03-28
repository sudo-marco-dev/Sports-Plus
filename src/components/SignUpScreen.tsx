import { useState } from 'react';
import { User, Mail, Lock, MapPin, Calendar, Trophy, Upload, ArrowLeft, Camera, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FaceVerificationDialog } from './FaceVerificationDialog';
import { toast } from 'sonner';

interface SignUpScreenProps {
  onSignUp: (data: any) => void;
  onBack: () => void;
}

const sports = ['Basketball', 'Volleyball', 'Football', 'Badminton', 'Tennis', 'Swimming'];
const skillLevels = ['Casual', 'Novice', 'Elite'];

export function SignUpScreen({ onSignUp, onBack }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    age: 0,
    isMinor: false,
    selectedSports: [] as string[],
    skillLevel: '',
    location: '',
    agreedToTerms: false,
    parentGuardianName: '',
    parentEmail: '',
    hasParentalConsent: false,
  });
  const [idUploaded, setIdUploaded] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [showParentalConsentModal, setShowParentalConsentModal] = useState(false);

  const computeAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    const age = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    return Math.max(0, age);
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateOfBirth = e.target.value;
    const age = computeAge(dateOfBirth);
    const isMinor = age < 18;
    setFormData(prev => ({
      ...prev,
      dateOfBirth,
      age,
      isMinor,
    }));
  };

  const toggleSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSports: prev.selectedSports.includes(sport)
        ? prev.selectedSports.filter(s => s !== sport)
        : [...prev.selectedSports, sport]
    }));
  };

  const handleIdUpload = () => {
    // Simulate ID upload
    setIdUploaded(true);
    toast.success('ID uploaded successfully!');
    
    // After ID upload, prompt for face verification
    setTimeout(() => {
      setShowFaceVerification(true);
    }, 500);
  };

  const handleFaceVerified = () => {
    setFaceVerified(true);
    toast.success('Face verified! You can now create your account.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    if (!idUploaded) {
      toast.error('Please upload a valid ID to continue');
      return;
    }
    
    if (!faceVerified) {
      toast.error('Please complete face verification');
      return;
    }
    
    if (!formData.agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    // If user is a minor and hasn't provided parental consent, show modal
    if (formData.isMinor && !formData.hasParentalConsent) {
      setShowParentalConsentModal(true);
      return;
    }
    
    onSignUp({ ...formData, isVerified: true, faceVerified: true });
  };

  const handleParentalConsentSubmit = (parentGuardianName: string, parentEmail: string) => {
    setFormData(prev => ({
      ...prev,
      parentGuardianName,
      parentEmail,
      hasParentalConsent: true,
    }));
    setShowParentalConsentModal(false);
    // Proceed with signup after consent is given
    onSignUp({ 
      ...formData, 
      parentGuardianName,
      parentEmail,
      hasParentalConsent: true,
      isVerified: true, 
      faceVerified: true 
    });
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-2xl p-3">
            <Trophy className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white text-2xl">Create Account</h1>
            <p className="text-white/80 text-sm">Join the SportsPlus community</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your Full Name"
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Username"
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-700">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleDateOfBirthChange}
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
              {formData.dateOfBirth && formData.age > 0 && (
                <p className="text-xs text-gray-600">Age: {formData.age} years old</p>
              )}
              {formData.isMinor && (
                <p className="text-xs text-orange-600 font-semibold">⚠️ Parental consent will be required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Favorite Sports (Select multiple)</Label>
              <div className="grid grid-cols-2 gap-2">
                {sports.map((sport) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={`py-3 px-4 rounded-xl border-2 transition-all text-sm ${
                      formData.selectedSports.includes(sport)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Skill Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {skillLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, skillLevel: level })}
                    className={`py-3 rounded-xl border-2 transition-all text-center ${
                      formData.skillLevel === level
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Select location on map"
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">📍 Tap to select on map</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Label className="text-gray-700">ID Verification</Label>
                <span className="text-red-500 text-sm font-semibold">*Required</span>
              </div>
              <div className={`border-2 ${
                faceVerified 
                  ? 'border-green-300 bg-green-50' 
                  : idUploaded 
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-dashed border-gray-300 bg-gray-50'
              } rounded-xl p-6 text-center transition-all`}>
                {!idUploaded && !faceVerified ? (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Upload valid ID</p>
                    <p className="text-xs text-gray-500 mb-3">Required to create and join games</p>
                    <Button
                      type="button"
                      onClick={handleIdUpload}
                      variant="outline"
                      className="mt-2 rounded-xl"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </>
                ) : idUploaded && !faceVerified ? (
                  <>
                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-700 font-semibold mb-1">ID Uploaded!</p>
                    <p className="text-xs text-blue-600 mb-3">Now verify your face to continue</p>
                    <Button
                      type="button"
                      onClick={() => setShowFaceVerification(true)}
                      className="mt-2 rounded-xl bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Verify Face
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">✓</div>
                      <span className="text-sm font-semibold">Fully Verified</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs text-green-700">
                      <div className="flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>ID</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Face</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {faceVerified && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-xs text-green-700 text-center">
                    ✓ Your identity has been verified. You can now create your account!
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <Dialog>
                  <DialogTrigger className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </DialogTrigger>
                  <DialogContent className="max-w-[90%] max-h-[80vh] rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Terms & Conditions</DialogTitle>
                      <DialogDescription>
                        Please review our terms and conditions before creating an account
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4 mt-4">
                      <div className="space-y-4 text-sm">
                        <section>
                          <h3 className="text-gray-900 mb-2">1. Acceptance of Terms</h3>
                          <p className="text-gray-600">By creating an account on SportsPlus, you agree to comply with these terms and conditions.</p>
                        </section>
                        <section>
                          <h3 className="text-gray-900 mb-2">2. User Responsibilities</h3>
                          <p className="text-gray-600">You are responsible for maintaining the confidentiality of your account and for all activities under your account.</p>
                        </section>
                        <section>
                          <h3 className="text-gray-900 mb-2">3. Community Safety</h3>
                          <p className="text-gray-600">Users must show up to confirmed games. No-shows negatively impact reliability scores. Repeated violations may result in account suspension.</p>
                        </section>
                        <section>
                          <h3 className="text-gray-900 mb-2">4. Verification</h3>
                          <p className="text-gray-600">ID and face verification are required to create and join games. Verified users are trusted by the community.</p>
                        </section>
                        <section>
                          <h3 className="text-gray-900 mb-2">5. Privacy Policy</h3>
                          <p className="text-gray-600">We collect and use your data to provide our services. Your location data is used to show nearby games. Personal information is never shared with third parties without consent. Biometric data from face verification is encrypted and used solely for identity verification.</p>
                        </section>
                        <section>
                          <h3 className="text-gray-900 mb-2">6. Reporting & Safety</h3>
                          <p className="text-gray-600">Users can report inappropriate behavior. False reports may affect your reliability score. Always meet in public, well-lit locations.</p>
                        </section>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                {' '}and Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl shadow-lg shadow-blue-500/30 mt-6"
              disabled={!formData.agreedToTerms || !faceVerified}
            >
              Create Account
            </Button>
          </form>
        </div>
      </ScrollArea>

      {/* Parental Consent Modal */}
      {showParentalConsentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowParentalConsentModal(false)}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
            >
              ✕
            </button>
            
            <div>
              <h2 className="text-lg font-bold text-gray-900">Parental Consent Required</h2>
              <p className="text-sm text-gray-600 mt-1">
                Since you are under 18, a parent or guardian must provide consent before your account can be created.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="parentGuardianName" className="text-sm text-gray-700">Parent/Guardian Full Name *</Label>
                <Input
                  id="parentGuardianName"
                  type="text"
                  placeholder="e.g., Jane Doe"
                  value={formData.parentGuardianName}
                  onChange={(e) => setFormData({ ...formData, parentGuardianName: e.target.value })}
                  className="mt-1 h-10 rounded-lg border-gray-200 bg-gray-50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="parentEmail" className="text-sm text-gray-700">Parent/Guardian Email *</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="parent@example.com"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className="mt-1 h-10 rounded-lg border-gray-200 bg-gray-50"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 leading-relaxed">
                  📧 A confirmation email will be sent to the parent/guardian to verify consent. The account will be activated once consent is confirmed.
                </p>
              </div>

              <div className="flex items-start gap-3 py-2">
                <Checkbox
                  id="parentalConsent"
                  checked={formData.parentGuardianName !== '' && formData.parentEmail !== ''}
                  disabled
                  className="mt-1"
                />
                <label htmlFor="parentalConsent" className="text-xs text-gray-600 leading-relaxed">
                  I confirm that the information provided above is accurate and I am the parent/guardian of the account holder.
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowParentalConsentModal(false)}
                className="flex-1 h-10 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (!formData.parentGuardianName.trim() || !formData.parentEmail.trim()) {
                    toast.error('Please fill in all fields');
                    return;
                  }
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
                    toast.error('Please enter a valid email address');
                    return;
                  }
                  handleParentalConsentSubmit(formData.parentGuardianName, formData.parentEmail);
                  toast.success('Parental consent submitted! Account created successfully.');
                }}
                className="flex-1 h-10 rounded-lg bg-green-600 hover:bg-green-700"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Face Verification Dialog */}
      <FaceVerificationDialog
        isOpen={showFaceVerification}
        onClose={() => setShowFaceVerification(false)}
        onVerified={handleFaceVerified}
        userName={formData.fullName || 'User'}
      />
    </div>
  );
}