import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, Building2, MapPin, Trophy, ArrowLeft, ChevronRight, Briefcase, Calendar, ShieldCheck, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { MobileContainer } from './MobileContainer';
import { UserRole } from './RoleSelectionScreen';
import { toast } from 'sonner';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string(),
  dateOfBirth: z.string().optional(),
  // Organization fields
  orgName: z.string().optional(),
  officialDesignation: z.string().optional(),
  businessAddress: z.string().optional(),
  // Coach fields
  specialization: z.array(z.string()).optional(),
  yearsExperience: z.string().optional(),
  // Player fields
  preferredSports: z.array(z.string()).optional(),
  isPWD: z.boolean().optional(),
  skillLevel: z.string().optional(),
  agreedToTerms: z.boolean().refine(v => v === true, 'You must agree to terms'),
}).superRefine((data, ctx) => {
  if (data.role === 'organization') {
    if (!data.orgName || data.orgName.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Organization name is required", path: ['orgName'] });
    }
    if (!data.officialDesignation || data.officialDesignation.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Designation is required", path: ['officialDesignation'] });
    }
    if (!data.businessAddress || data.businessAddress.length < 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Business address is required", path: ['businessAddress'] });
    }
  } else {
    // Player and Coach need Date of Birth usually, but prompt says "Remove Date of Birth" for Org.
    // So let's keep it for Player/Coach if it was there before, but actually the prompt says
    // "Remove: Date of Birth" for Org. implying it stays for others.
    if (!data.dateOfBirth) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Date of birth is required", path: ['dateOfBirth'] });
    }
  }

  if (data.role === 'coach') {
    if (!data.yearsExperience) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Years of experience is required", path: ['yearsExperience'] });
    }
    if (!data.specialization || data.specialization.length === 0) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Select at least one specialty", path: ['specialization'] });
    }
  }

  if (data.role === 'player') {
    if (!data.skillLevel) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Select a skill level", path: ['skillLevel'] });
    }
  }
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface UnifiedSignUpScreenProps {
  role: UserRole;
  onSignUp: (data: any) => void;
  onBack: () => void;
}

const sports = ['Basketball', 'Volleyball', 'Football', 'Badminton', 'Tennis', 'Swimming'];
const skillLevels = ['Casual', 'Novice', 'Elite'];

export function UnifiedSignUpScreen({ role, onSignUp, onBack }: UnifiedSignUpScreenProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role,
      preferredSports: [],
      specialization: [],
      isPWD: false,
      agreedToTerms: false,
    }
  });

  const selectedSports = watch('preferredSports') || [];
  const selectedSpecialties = watch('specialization') || [];

  const toggleItem = (field: 'preferredSports' | 'specialization', item: string) => {
    const current = watch(field) || [];
    const next = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    setValue(field, next, { shouldValidate: true });
  };

  const onSubmit = (data: SignUpFormData) => {
    onSignUp(data);
  };

  const getIdLabel = () => {
    switch (role) {
      case 'organization': return 'Government Permit or Business License';
      case 'coach': return 'Professional Certification or Valid ID';
      default: return 'Valid Government ID';
    }
  };

  return (
    <MobileContainer className="bg-white dark:bg-slate-900 transition-colors">
      {/* Header - Fixed contrast: Light background with dark text */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 pt-10 pb-12 px-6 relative border-b border-purple-100/50 dark:border-slate-800">
        <button 
          onClick={onBack} 
          className="mb-6 p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-purple-200 dark:border-slate-700 shadow-sm hover:bg-purple-50 dark:hover:bg-slate-750 transition-all flex items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-lg shadow-purple-200/50 dark:shadow-none border border-purple-100 dark:border-slate-700">
            {role === 'player' && <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
            {role === 'organization' && <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
            {role === 'coach' && <GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Step 2: {role.charAt(0).toUpperCase() + role.slice(1)} Details</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8 pb-32">
          <form id="sign-up-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Basic Information</h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-purple-600 transition-colors" />
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="Enter full name"
                    className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-purple-500 transition-all dark:text-white"
                  />
                  {errors.fullName && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.fullName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-purple-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="name@example.com"
                    className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-purple-500 transition-all dark:text-white"
                  />
                  {errors.email && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-purple-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-purple-500 transition-all dark:text-white"
                  />
                  {errors.password && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.password.message}</p>}
                </div>
              </div>

              {role !== 'organization' && (
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Date of Birth</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register('dateOfBirth')}
                      className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-purple-500 transition-all dark:text-white [color-scheme:dark]"
                    />
                    {errors.dateOfBirth && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.dateOfBirth.message}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Role Specific Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">
                {role.charAt(0).toUpperCase() + role.slice(1)} Details
              </h3>

              {role === 'organization' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="orgName" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Organization Name</Label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="orgName"
                        {...register('orgName')}
                        placeholder="e.g. LGU Dept / Sports Office"
                        className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                      />
                      {errors.orgName && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.orgName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="officialDesignation" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Official Designation</Label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="officialDesignation"
                        {...register('officialDesignation')}
                        placeholder="e.g. Sports Coordinator"
                        className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                      />
                      {errors.officialDesignation && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.officialDesignation.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="businessAddress" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Official Business Address</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="businessAddress"
                        {...register('businessAddress')}
                        placeholder="Enter full address"
                        className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                      />
                      {errors.businessAddress && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.businessAddress.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {role === 'coach' && (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="yearsExperience" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Years of Experience</Label>
                    <div className="relative group">
                      <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-purple-600 transition-colors" />
                      <Input
                        id="yearsExperience"
                        type="number"
                        {...register('yearsExperience')}
                        placeholder="e.g. 5"
                        className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                      />
                      {errors.yearsExperience && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.yearsExperience.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700 dark:text-slate-300 font-bold ml-1">Primary Sport Specialization</Label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {sports.map((sport) => (
                        <button
                          key={sport}
                          type="button"
                          onClick={() => toggleItem('specialization', sport)}
                          className={`py-3.5 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
                            selectedSpecialties.includes(sport)
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm'
                              : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50'
                          }`}
                        >
                          <span className="text-sm font-semibold">{sport}</span>
                        </button>
                      ))}
                    </div>
                    {errors.specialization && <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.specialization.message}</p>}
                  </div>
                </div>
              )}

              {role === 'player' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-slate-700 dark:text-slate-300 font-bold ml-1">Favorite Sports</Label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {sports.map((sport) => (
                        <button
                          key={sport}
                          type="button"
                          onClick={() => toggleItem('preferredSports', sport)}
                          className={`py-3.5 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
                            selectedSports.includes(sport)
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm'
                              : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50'
                          }`}
                        >
                          <span className="text-sm font-semibold">{sport}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700 dark:text-slate-300 font-bold ml-1">Skill Level</Label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {skillLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setValue('skillLevel', level, { shouldValidate: true })}
                          className={`py-3.5 rounded-2xl border-2 transition-all text-center ${
                            watch('skillLevel') === level
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold shadow-sm'
                              : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50'
                          }`}
                        >
                          <span className="text-xs uppercase tracking-wider">{level}</span>
                        </button>
                      ))}
                    </div>
                    {errors.skillLevel && <p className="text-rose-500 text-xs mt-1 ml-1 font-medium">{errors.skillLevel.message}</p>}
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                    <Checkbox
                      id="isPWD"
                      onCheckedChange={(checked) => setValue('isPWD', checked === true)}
                    />
                    <label htmlFor="isPWD" className="text-sm text-purple-900 dark:text-purple-300 font-semibold cursor-pointer">
                      I am a PWD (Person with Disability)
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Verification Label Correction */}
            <div className="space-y-3 pt-4">
              <Label className="text-slate-700 dark:text-slate-300 font-bold ml-1">{getIdLabel()}</Label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">Tap to upload verification</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-4 px-1">
              <Checkbox
                id="agreedToTerms"
                onCheckedChange={(checked) => setValue('agreedToTerms', checked === true, { shouldValidate: true })}
                className="mt-1 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="agreedToTerms" className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed font-medium">
                By ticking this box, you agree to our <span className="text-purple-600 dark:text-purple-400 font-bold">Terms of Service</span> and <span className="text-purple-600 dark:text-purple-400 font-bold">Privacy Policy</span>.
              </label>
            </div>
            {errors.agreedToTerms && <p className="text-rose-500 text-xs mt-1 ml-1 font-medium">{errors.agreedToTerms.message}</p>}

          </form>
        </div>
      </ScrollArea>

      {/* Floating Footer Button - ensure it remains visible */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <Button
          form="sign-up-form"
          type="submit"
          className="w-full h-15 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
        >
          Create Account
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </MobileContainer>
  );
}
