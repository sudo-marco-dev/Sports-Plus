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
    if (!data.dateOfBirth) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Date of birth is required", path: ['dateOfBirth'] });
    }
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
  const { register, handleSubmit, watch, setValue } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role,
      dateOfBirth: '',
      orgName: '',
      officialDesignation: '',
      businessAddress: '',
      preferredSports: [],
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
    <MobileContainer className="bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* Header - Dynamic Gradient matching Login */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-10 pb-16 px-10 relative rounded-b-[3rem] shadow-lg shadow-blue-900/20">
        <button 
          onClick={onBack} 
          className="mb-6 p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm hover:bg-white/30 transition-all flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-xl shadow-blue-900/20 border border-white/50">
            {role === 'player' && <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            {role === 'organization' && <Building2 className="w-8 h-8 text-green-600 dark:text-green-400" />}
          </div>
          <div>
            <h1 className="text-white text-2xl font-black tracking-tight">Create Account</h1>
            <p className="text-white/80 text-sm font-bold">Step 2: {role.charAt(0).toUpperCase() + role.slice(1)} Details</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 -mt-8">
        <div className="px-6 space-y-8 pb-32">
          <form id="sign-up-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...register('role')} />
            
            {/* Basic Information Section - Card Style */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider ml-1">Basic Information</h3>
              
              {role !== 'organization' && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      placeholder="Enter full name"
                      className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-blue-500 transition-all dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="name@example.com"
                    className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-blue-500 transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-blue-500 transition-all dark:text-white"
                  />
                </div>
              </div>

              {role !== 'organization' && (
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Date of Birth</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register('dateOfBirth')}
                      className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-blue-500 transition-all dark:text-white [color-scheme:dark]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Role Specific Section - Card Style */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 space-y-4 pt-4">
              <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider ml-1">
                {role.charAt(0).toUpperCase() + role.slice(1)} Details
              </h3>

              {role === 'organization' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="orgName" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Organization Name</Label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-green-600 transition-colors" />
                      <Input
                        id="orgName"
                        {...register('orgName')}
                        placeholder="e.g. LGU Dept / Sports Office"
                        className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="officialDesignation" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Official Designation</Label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-green-600 transition-colors" />
                      <Input
                        id="officialDesignation"
                        {...register('officialDesignation')}
                        placeholder="e.g. Sports Coordinator"
                        className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="businessAddress" className="text-slate-700 dark:text-slate-300 font-bold ml-1">Official Business Address</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-green-600 transition-colors" />
                      <Input
                        id="businessAddress"
                        {...register('businessAddress')}
                        placeholder="Enter full address"
                        className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                      />
                    </div>
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
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
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
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
                              : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50'
                          }`}
                        >
                          <span className="text-xs uppercase tracking-wider">{level}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <Checkbox
                      id="isPWD"
                      onCheckedChange={(checked) => setValue('isPWD', checked === true)}
                    />
                    <label htmlFor="isPWD" className="text-sm text-blue-900 dark:text-blue-300 font-semibold cursor-pointer">
                      I am a PWD (Person with Disability)
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Terms Section - Minimal Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <Checkbox
                id="agreedToTerms"
                onCheckedChange={(checked) => setValue('agreedToTerms', checked === true, { shouldValidate: true })}
                className="mt-1 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="agreedToTerms" className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed font-medium">
                By ticking this box, you agree to our <span className="text-blue-600 dark:text-blue-400 font-bold">Terms of Service</span> and <span className="text-blue-600 dark:text-blue-400 font-bold">Privacy Policy</span>.
              </label>
            </div>
          </form>
        </div>
      </ScrollArea>

      {/* Floating Footer Button - ensure it remains visible */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <Button
          onClick={() => onSignUp(watch() as any)}
          type="button"
          className="w-full h-15 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
        >
          Create Account
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </MobileContainer>
  );
}
