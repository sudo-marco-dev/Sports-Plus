import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Clock, Star, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MiniProfileCard } from './MiniProfileCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner';
import { GameScoreVotingDialog } from './GameScoreVotingDialog';

interface CreatorGameViewScreenProps {
  gameId: string;
  gameData: {
    title: string;
    sport: string;
    location: string;
    date: string;
    time: string;
    maxPlayers: number;
  };
  onBack: () => void;
  onCancelGame: () => void;
  onFinishGame: () => void;
}

interface Participant {
  id: string;
  name: string;
  verified: boolean;
  position: number;
  rating: number;
  gamesPlayed: number;
  joinedAt: string;
}

// Mock participants that join over time
const mockParticipants: Participant[] = [
  { id: '1', name: 'John Doe', verified: true, position: 1, rating: 4.7, gamesPlayed: 24, joinedAt: '2 min ago' },
  { id: '2', name: 'Maria Santos', verified: true, position: 2, rating: 4.8, gamesPlayed: 32, joinedAt: '5 min ago' },
  { id: '3', name: 'Alex Chen', verified: false, position: 3, rating: 4.2, gamesPlayed: 12, joinedAt: '8 min ago' },
];

export function CreatorGameViewScreen({ 
  gameId: _gameId, 
  gameData, 
  onBack, 
  onCancelGame,
  onFinishGame 
}: CreatorGameViewScreenProps) {
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const currentPlayers = participants.length;

  const handleRemovePlayer = (playerId: string) => {
    setParticipants((prev: Participant[]) => prev.filter((p: Participant) => p.id !== playerId));
  };

  const handleFinishGameClick = () => {
    setShowScoreDialog(true);
  };

  const handleScoresSubmitted = (_teamAScore: number, _teamBScore: number) => {
    toast.success('Game completed successfully!');
    setTimeout(() => {
      setShowScoreDialog(false);
      onFinishGame();
    }, 2000);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl">Your Game</h1>
            <p className="text-white/80 text-sm">Manage participants</p>
          </div>
          <Badge className="bg-green-500 text-white">
            Creator
          </Badge>
        </div>

        {/* Game Header */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">{gameData.sport}</div>
            <div className="flex-1">
              <h3 className="text-white">{gameData.title}</h3>
              <Badge className="bg-white/30 text-white border-white/30 mt-1">
                {currentPlayers}/{gameData.maxPlayers} players
              </Badge>
            </div>
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{gameData.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="w-4 h-4" />
              <span>{gameData.date}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-4 h-4" />
              <span>{gameData.time}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Users className="w-4 h-4" />
              <span>{currentPlayers} joined</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <ScrollArea className="flex-1 px-6 mt-4">
        <div className="space-y-4 pb-24">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Participants</h3>
            <Badge variant="outline" className="text-xs">
              {participants.filter((p: Participant) => p.verified).length} verified
            </Badge>
          </div>

          {participants.length > 0 ? (
            <div className="space-y-3">
              {participants.map((participant: Participant) => (
                <div
                  key={participant.id}
                  className="bg-white rounded-2xl shadow-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-700 flex-shrink-0">
                      #{participant.position}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPlayer({
                          name: participant.name,
                          username: participant.name.toLowerCase().replace(' ', '_'),
                          userId: `SP2025-${1000 + parseInt(participant.id)}`,
                          isVerified: participant.verified,
                          rating: participant.rating,
                          gamesPlayed: participant.gamesPlayed,
                          reliabilityScore: 90,
                        });
                      }}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-gray-900 truncate">{participant.name}</p>
                          {participant.verified && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{participant.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-600">{participant.gamesPlayed} games</span>
                        </div>
                        <span className="text-xs text-gray-500">Joined {participant.joinedAt}</span>
                      </div>
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0 rounded-md inline-flex items-center justify-center transition-colors">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90%] rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Player?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {participant.name} from this game?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
                          <AlertDialogCancel className="flex-1 m-0 rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemovePlayer(participant.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Users className="size-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-gray-900 mb-2">No Participants Yet</h3>
              <p className="text-sm text-gray-600">
                Players will appear here when they join your game.
              </p>
            </div>
          )}

          {currentPlayers < gameData.maxPlayers && (
            <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-4 text-center">
              <Users className="size-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-blue-700">
                {gameData.maxPlayers - currentPlayers} more {gameData.maxPlayers - currentPlayers === 1 ? 'player' : 'players'} needed
              </p>
            </div>
          )}

          {/* Game Actions */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleFinishGameClick}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-xl h-12"
            >
              Finish Game
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 h-12 px-4 py-2 inline-flex items-center justify-center transition-colors">
                  Cancel Game
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90%] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Game?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this game? All participants will be notified.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
                  <AlertDialogCancel className="flex-1 m-0 rounded-xl">Keep Game</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onCancelGame}
                    className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                  >
                    Cancel Game
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </ScrollArea>

      {/* Mini Profile Card */}
      {selectedPlayer && (
        <MiniProfileCard
          user={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onViewFullProfile={() => {
            setSelectedPlayer(null);
          }}
        />
      )}

      {/* Game Score Voting Dialog */}
      {showScoreDialog && (
        <GameScoreVotingDialog
          open={showScoreDialog}
          onOpenChange={setShowScoreDialog}
          isHost={true}
          gameTitle={gameData.title}
          onScoresSubmitted={handleScoresSubmitted}
        />
      )}
    </div>
  );
}