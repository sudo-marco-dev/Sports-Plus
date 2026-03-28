import { Download, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Certificate } from '../data/mockData';

interface CertificateViewProps {
  certificate: Certificate;
  onClose: () => void;
}

export function CertificateView({ certificate, onClose }: CertificateViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg">
        {/* Header with Close and Print */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Certificate</h2>
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Print
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-lg"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="p-12 print:p-0">
          {/* Certificate Card */}
          <div
            className="border-2 border-blue-500 rounded-xl p-8 text-center space-y-6 bg-gradient-to-br from-blue-50 to-white"
            style={{
              boxShadow: 'inset 0 0 0 1px #93C5FD',
            }}
          >
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-blue-600 mb-2">Sports Plus</h1>
              <p className="text-xl text-gray-600 font-semibold">
                Certificate of Participation
              </p>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-blue-300"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="h-px w-12 bg-blue-300"></div>
            </div>

            {/* Body Text */}
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <p className="text-gray-800 text-lg leading-relaxed">
                This certifies that{' '}
                <span className="font-bold text-blue-600">{certificate.playerName}</span>{' '}
                participated in <span className="font-bold">{certificate.gameName}</span> —{' '}
                <span className="italic">{certificate.sport}</span> held at{' '}
                <span className="font-semibold">{certificate.venue}</span> on{' '}
                <span className="font-semibold">
                  {new Date(certificate.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>

            {/* Points Section */}
            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-yellow-600">{certificate.pointsEarned}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-blue-200">
              <p className="text-sm text-gray-600">
                Sports Plus · Your Game, Your Community
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 print:hidden">
          <Button
            onClick={handlePrint}
            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Print Certificate
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
