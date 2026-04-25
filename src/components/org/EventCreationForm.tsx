import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Upload, MapPin, Calendar, Clock, Users, Plus, X, Trophy, ChevronRight, ChevronLeft, Check, Image } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface EventFormData {
  title: string;
  description: string;
  sport: string;
  date: string;
  time: string;
  venue: string;
  maxPlayers: string;
  waiverText: string;
  minAge: string;
  minRank: string;
  sponsors: Array<{ name: string; logo: string }>;
}

interface EventCreationFormProps {
  onSubmit: (data: EventFormData) => void;
}

const sports = ['Basketball', 'Volleyball', 'Football', 'Badminton', 'Tennis', 'Swimming'];
const venues = [
  'Taguig Sports Complex',
  'Pasig Badminton Center',
  'Rizal Memorial Coliseum',
  'Makati Sports Center',
  'BGC Futsal Arena',
  'Ateneo Oval',
];

const TOTAL_STEPS = 3;

export function EventCreationForm({ onSubmit }: EventCreationFormProps) {
  const [step, setStep] = useState(1);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      title: '', description: '', sport: '', date: '', time: '',
      venue: '', maxPlayers: '20', waiverText: '', minAge: '16', minRank: '0',
      sponsors: [{ name: '', logo: '' }],
    },
  });

  const [sponsors, setSponsors] = useState<Array<{ name: string; logo: string }>>([{ name: '', logo: '' }]);

  const watchSport = watch('sport');

  const handleBannerUpload = () => {
    setBannerPreview('banner-preview');
    toast.success('Banner image uploaded!');
  };

  const addSponsor = () => {
    setSponsors(prev => [...prev, { name: '', logo: '' }]);
  };

  const removeSponsor = (index: number) => {
    if (sponsors.length <= 1) return;
    setSponsors(prev => prev.filter((_, i) => i !== index));
  };

  const updateSponsor = (index: number, field: 'name' | 'logo', value: string) => {
    setSponsors(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const nextStep = () => { if (step < TOTAL_STEPS) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const onFormSubmit = (data: EventFormData) => {
    onSubmit({ ...data, sponsors: sponsors.filter(s => s.name.trim() !== '') });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pb-12">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2 mb-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              s === step ? 'bg-purple-600 text-white shadow-lg' :
              s < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-1 rounded-full ${s < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-gray-500 mb-4">
        {step === 1 ? 'Event Details' : step === 2 ? 'Schedule & Venue' : 'Requirements & Sponsors'}
      </p>

      {/* Step 1: Event Details */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Banner Upload */}
          <div className="space-y-2">
            <Label className="text-gray-700">Event Banner</Label>
            <div
              onClick={handleBannerUpload}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-purple-400 ${
                bannerPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              {bannerPreview ? (
                <div className="space-y-2">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-400 via-blue-500 to-green-400 rounded-xl flex items-center justify-center">
                    <Image className="w-10 h-10 text-white/80" />
                  </div>
                  <p className="text-sm text-green-700 font-semibold">✓ Banner uploaded</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tap to upload event banner</p>
                  <p className="text-xs text-gray-400">Recommended: 1200×400px</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">Event Title *</Label>
            <Input
              id="title" {...register('title', { required: true })}
              placeholder="e.g., Metro Manila Basketball Cup"
              className="h-12 rounded-xl border-gray-200 bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">Description</Label>
            <Textarea
              id="description" {...register('description')}
              placeholder="Describe the event, rules, prizes..."
              className="min-h-[80px] rounded-xl border-gray-200 bg-gray-50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Sport Type *</Label>
            <Select value={watchSport} onValueChange={(v) => setValue('sport', v)}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50">
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="button" onClick={nextStep}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl"
          >
            Next: Schedule & Venue <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Schedule & Venue */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700">Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="date" type="date" {...register('date', { required: true })}
                  className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-gray-700">Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="time" type="time" {...register('time', { required: true })}
                  className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Venue *</Label>
            <Select value={watch('venue')} onValueChange={(v) => setValue('venue', v)}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPlayers" className="text-gray-700">Max Participants</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input id="maxPlayers" type="number" {...register('maxPlayers')}
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={prevStep} variant="outline"
              className="flex-1 h-12 rounded-xl">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button type="button" onClick={nextStep}
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Requirements & Sponsors */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="minAge" className="text-gray-700">Min Age</Label>
              <Input id="minAge" type="number" {...register('minAge')}
                className="h-12 rounded-xl border-gray-200 bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minRank" className="text-gray-700">Min Rank</Label>
              <Input id="minRank" type="number" {...register('minRank')}
                className="h-12 rounded-xl border-gray-200 bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waiverText" className="text-gray-700">Waiver Text</Label>
            <Textarea id="waiverText" {...register('waiverText')}
              placeholder="Enter waiver/disclaimer text for participants..."
              className="min-h-[60px] rounded-xl border-gray-200 bg-gray-50 resize-none" />
          </div>

          {/* Sponsors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700">Sponsors</Label>
              <button type="button" onClick={addSponsor}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-semibold">
                <Plus className="w-3 h-3" /> Add Sponsor
              </button>
            </div>
            {sponsors.map((sponsor, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <Input value={sponsor.name}
                    onChange={(e) => updateSponsor(idx, 'name', e.target.value)}
                    placeholder="Sponsor name" className="h-8 text-sm rounded-lg border-gray-200" />
                  <Input value={sponsor.logo}
                    onChange={(e) => updateSponsor(idx, 'logo', e.target.value)}
                    placeholder="Logo URL (optional)" className="h-8 text-sm rounded-lg border-gray-200" />
                </div>
                {sponsors.length > 1 && (
                  <button type="button" onClick={() => removeSponsor(idx)}
                    className="p-1 text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={prevStep} variant="outline"
              className="flex-1 h-12 rounded-xl">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg">
              Publish Event
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
