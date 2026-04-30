import { useState } from 'react';
import { User, Mail, Lock, MapPin, Calendar, Trophy, Upload, ArrowLeft, Camera, Eye, Building2, Briefcase, ChevronRight } from 'lucide-react';
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
const accountTypes = ['Player', 'Organization'];

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
    accountType: 'Player',
    isPWD: false,
    selectedSports: [] as string[],
    skillLevel: '',
    location: '',
    agreedToTerms: true, // Default to true for demo
    // Organization fields
    orgName: '',
    officialDesignation: '',
    businessAddress: '',
  });

  const [idUploaded, setIdUploaded] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(false);

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
    setIdUploaded(true);
    toast.success('Document uploaded successfully!');
    setTimeout(() => {
      setShowFaceVerification(true);
    }, 500);
  };

  const handleFaceVerified = () => {
    setFaceVerified(true);
    toast.success('Identity verified!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate bypass for demo
    onSignUp({ ...formData, isVerified: true, faceVerified: true });
  };

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - Blue/Green Gradient */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-10 pb-20 px-8 relative shrink-0">
        <button
          onClick={onBack}
          className="mb-6 p-2 text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl p-3 shadow-lg">
            <Trophy className="w-8 h-8 text-blue-600" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Create Account</h1>
            <p className="text-white/80 text-sm">Join the SportsPlus community</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 -mt-8 pb-10 z-10">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-black/5 p-6 space-y-8 mb-10">
          {/* Role Selection Toggle */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 ml-1">Account Type</h3>
            <div className="flex gap-3">
              {accountTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: type })}
                  className={`flex-1 py-3 rounded-2xl border-2 transition-all text-center font-semibold text-sm ${formData.accountType === type
                      ? 'border-blue-500 text-blue-600'
                      : 'border-gray-100 text-gray-500 hover:border-gray-200'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Basic Information</h3>

              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-gray-700 font-bold">
                  {formData.accountType === 'Organization' ? 'Contact Person Name' : 'Full Name'}
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter name"
                    className="pl-12 h-14 rounded-2xl border-gray-200 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-700 font-bold">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="pl-12 h-14 rounded-2xl border-gray-200 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-gray-700 font-bold">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl border-gray-200 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {formData.accountType === 'Player' && (
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="text-gray-700 font-bold">Date of Birth</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleDateOfBirthChange}
                      className="pl-12 h-14 rounded-2xl border-gray-200 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Role Specific Section */}
            {formData.accountType === 'Organization' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Organization Details</h3>

                <div className="space-y-1.5">
                  <Label htmlFor="orgName" className="text-gray-700 font-bold">Organization Name</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="orgName"
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      placeholder="e.g. Brgy. Sports Council"
                      className="pl-12 h-14 rounded-2xl border-gray-200 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="officialDesignation" className="text-gray-700 font-bold">Official Designation</Label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="officialDesignation"
                      value={formData.officialDesignation}
                      onChange={(e) => setFormData({ ...formData, officialDesignation: e.target.value })}
                      placeholder="e.g. Sports Coordinator"
                      className="pl-12 h-14 rounded-2xl border-gray-200 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="businessAddress" className="text-gray-700 font-bold">Official Business Address</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="businessAddress"
                      value={formData.businessAddress}
                      onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                      placeholder="Enter full address"
                      className="pl-12 h-14 rounded-2xl border-gray-200 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900">Player Profile</h3>

                <div className="space-y-3">
                  <Label className="text-gray-700 font-bold">Favorite Sports</Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {sports.map((sport) => (
                      <button
                        key={sport}
                        type="button"
                        onClick={() => toggleSport(sport)}
                        className={`py-3 px-4 rounded-full border transition-all text-sm font-semibold ${formData.selectedSports.includes(sport)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700 font-bold">Skill Level</Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {skillLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, skillLevel: level })}
                        className={`py-3 rounded-full border transition-all text-center text-sm font-semibold ${formData.skillLevel === level
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Checkbox
                    id="isPWD"
                    checked={formData.isPWD}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPWD: checked as boolean })}
                  />
                  <label htmlFor="isPWD" className="text-sm text-gray-700 font-bold cursor-pointer">
                    I am a PWD (Person with Disability)
                  </label>
                </div>
              </div>
            )}

            {/* Verification Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  {formData.accountType === 'Organization' ? 'Legal Verification' : 'Identity Verification'}
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">*Required</span>
              </div>

              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${faceVerified ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}>
                {!idUploaded ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {formData.accountType === 'Organization' ? 'Government Permit / License' : 'Valid Government ID'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Required for full platform access</p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleIdUpload}
                      variant="outline"
                      className="mt-2 rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-gray-50 bg-white shadow-sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                ) : !faceVerified ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                      <Camera className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-blue-700">Almost there!</p>
                    <Button
                      type="button"
                      onClick={() => setShowFaceVerification(true)}
                      className="mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-200"
                    >
                      Verify Face
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-green-600 text-xl font-bold">✓</span>
                    </div>
                    <p className="text-sm font-black text-green-700 uppercase tracking-tight">Verified & Secure</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed font-medium mt-0.5">
                I agree to the <span className="text-blue-500 font-bold">Terms & Conditions</span> and <span className="text-blue-500 font-bold">Privacy Policy</span>.
              </label>
            </div>

            {/* Bottom Button Fixed in Scroll area for this layout */}
            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mb-10"
            >
              Create Account
            </Button>
          </form>
        </div>
      </ScrollArea>

      <FaceVerificationDialog
        isOpen={showFaceVerification}
        onClose={() => setShowFaceVerification(false)}
        onVerified={handleFaceVerified}
        userName={formData.fullName || 'User'}
      />
    </div>
  );
}