import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Users, CheckCircle2, Play, X, Trophy, Star, Flag, AlertCircle, Map, UserMinus, UserPlus, Send, MessageCircle, Gift, Share2, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { MiniProfileCard } from './MiniProfileCard';
import { ShareGameModal } from './ShareGameModal';
import { useAuth } from '../context/AuthContext';
import { CertificateView } from './CertificateView';
import { Certificate } from '../data/mockData';

interface QueueScreenProps {
  onBack: () => void;
  onLeaveGame?: (gameId: string) => void;
  onFinishGame?: (gameId: string, gameTitle: string, organizer: any) => void;
  onGameComplete?: () => void;
  onRewardsEarned?: (points: number, reliability: number) => void;
  gameData?: {
    id: string;
    title: string;
    sport: string;
    location: string;
    date: string;
    time: string;
    maxPlayers: number;
    latitude?: number;
    longitude?: number;
  };
  isHost?: boolean;
}

interface Player {
  id: string;
  name: string;
  verified: boolean;
  team: 1 | 2;
  isCurrentUser: boolean;
  ready?: boolean;
  rating?: number;
  skillLevel?: 'Casual' | 'Novice' | 'Elite';
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  skillLevel: 'Casual' | 'Novice' | 'Elite';
  online: boolean;
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

type GameState = 'waiting' | 'active' | 'finished' | 'host-score-entry' | 'vote-score' | 'rescore' | 'revote-score' | 'mvp-vote' | 'rating' | 'rewards' | 'completed';

const skillLevels: ('Casual' | 'Novice' | 'Elite')[] = ['Casual', 'Novice', 'Elite'];

const reportReasonsArray = [
  'Inappropriate behavior',
  "Didn't show up",
  'Poor sportsmanship',
  'Cheating/unfair play',
  'Verbal abuse',
  'Left early',
  'Other'
];

const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Chen', avatar: '', skillLevel: 'Elite', online: true },
  { id: 'tm2', name: 'Mike Rodriguez', avatar: '', skillLevel: 'Novice', online: true },
  { id: 'tm3', name: 'Emily Davis', avatar: '', skillLevel: 'Elite', online: false },
  { id: 'tm4', name: 'James Wilson', avatar: '', skillLevel: 'Casual', online: true },
];

export function QueueScreen({ onBack, onLeaveGame, gameData, isHost = false, onGameComplete, onRewardsEarned }: QueueScreenProps) {
  const { addPoints } = useAuth();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [userReady, setUserReady] = useState(false);
  const [userTeam, setUserTeam] = useState<1 | 2>(1);
  const [readyCount, setReadyCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [votesApproved, setVotesApproved] = useState(0);
  const [votesDisapproved, setVotesDisapproved] = useState(0);
  const [currentRatingIndex, setCurrentRatingIndex] = useState(0);
  const [playerRatings, setPlayerRatings] = useState<{ [key: string]: number }>({});
  const [playerComments, setPlayerComments] = useState<{ [key: string]: string }>({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportReasons, setSelectedReportReasons] = useState<string[]>([]);
  const [reportComment, setReportComment] = useState('');
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVote, setUserVote] = useState<'approve' | 'disagree' | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  const [kickingPlayerId, setKickingPlayerId] = useState<string | null>(null);
  const [invitedMembers, setInvitedMembers] = useState<Set<string>>(new Set());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', playerId: 'player-1', playerName: 'Alex Chen', message: 'Hey! Are we meeting 10 mins early?', timestamp: Date.now() - 300000 },
    { id: '2', playerId: 'player-2', playerName: 'Maria Santos', message: 'Sure, I\'ll be there by 5:45', timestamp: Date.now() - 240000 },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [allReadyMessage, setAllReadyMessage] = useState(false);
  const [hostStarting, setHostStarting] = useState(false);
  const [showRewardScreen, setShowRewardScreen] = useState(false);
  const [showCertificateView, setShowCertificateView] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [mvpVotes, setMvpVotes] = useState<{[playerId: string]: number}>({});
  const [hasVotedMvp, setHasVotedMvp] = useState(false);
  const [mvpWinner, setMvpWinner] = useState<Player | null>(null);
  const [showMvpReveal, setShowMvpReveal] = useState(false);

  useEffect(() => {
    if (gameData) {
      initializePlayers();
    }
  }, [gameData?.maxPlayers]);

  // HOST FLOW: Auto-ready all players after 4 seconds
  useEffect(() => {
    if (isHost && gameState === 'waiting' && players.length > 0) {
      const autoReadyTimer = setTimeout(() => {
        const updatedPlayers = players.map(p => ({ ...p, ready: true }));
        setPlayers(updatedPlayers);
        setReadyCount(players.length);
        setAllReadyMessage(true);
        toast.success('All players are ready! You can now start the game.');
      }, 4000);
      
      return () => clearTimeout(autoReadyTimer);
    }
  }, [isHost, gameState, players.length]);

  // NON-HOST FLOW: Original auto-ready behavior
  useEffect(() => {
    if (!isHost && gameState === 'waiting' && players.length > 0 && userReady) {
      const autoReadyTimer = setTimeout(() => {
        const updatedPlayers = players.map(p => ({ ...p, ready: true }));
        setPlayers(updatedPlayers);
        setReadyCount(players.length);
        setAllReadyMessage(true);
        toast.success('All players are ready!');
      }, 4000);
      
      return () => clearTimeout(autoReadyTimer);
    }
  }, [isHost, gameState, players, userReady]);

  // NON-HOST FLOW: Auto-start game
  useEffect(() => {
    if (!isHost && allReadyMessage && readyCount === players.length && players.length > 0 && gameState === 'waiting') {
      const autoStartTimer = setTimeout(() => {
        setHostStarting(true);
        toast.success('🎮 Host is starting the game...');
        
        setTimeout(() => {
          setTeam1Score('15');
          setTeam2Score('12');
          setGameState('vote-score');
          setHostStarting(false);
          toast.success('Game started! Vote on the score...');
        }, 1000);
      }, 2000);
      
      return () => clearTimeout(autoStartTimer);
    }
  }, [isHost, allReadyMessage, readyCount, players.length, gameState]);

  useEffect(() => {
    if (gameState === 'rewards') {
      const rewardsTimer = setTimeout(() => {
        setShowRewardScreen(true);
        
        // Determine if current user's team won
        const currentPlayer = players.find(p => p.isCurrentUser);
        if (currentPlayer && team1Score && team2Score) {
          const score1 = parseInt(team1Score);
          const score2 = parseInt(team2Score);
          const didWin = (currentPlayer.team === 1 && score1 > score2) || 
                         (currentPlayer.team === 2 && score2 > score1);
          
          // Award points based on win/loss
          addPoints(didWin ? 100 : 20);
        }
        
        onRewardsEarned?.(50, 5);
      }, 1000);
      return () => clearTimeout(rewardsTimer);
    } else {
      setShowRewardScreen(false);
    }
  }, [gameState, onRewardsEarned, players, team1Score, team2Score, addPoints]);

  const initializePlayers = () => {
    if (!gameData) return;

    const aiPlayerNames = [
      'Alex Chen', 'Maria Santos', 'John Doe', 'Sarah Lee', 'Mike Johnson',
      'Emma Wilson', 'David Kim', 'Lisa Brown', 'Tom Anderson', 'Anna Garcia',
      'Chris Taylor', 'Nina Patel', 'Ryan Clark', 'Sophie Martin', 'Jake Lewis'
    ];

    const newPlayers: Player[] = [];
    
    newPlayers.push({
      id: 'current-user',
      name: 'You',
      verified: true,
      team: 1,
      isCurrentUser: true,
      ready: false,
      rating: 4.7,
      skillLevel: 'Elite',
    });

    for (let i = 1; i < gameData.maxPlayers; i++) {
      const team = (i % 2 === 0) ? 1 : 2;
      const randomSkill = skillLevels[Math.floor(Math.random() * skillLevels.length)];
      const randomRating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
      newPlayers.push({
        id: `player-${i}`,
        name: aiPlayerNames[i - 1] || `Player ${i}`,
        verified: Math.random() > 0.3,
        team: team,
        isCurrentUser: false,
        ready: false,
        rating: randomRating,
        skillLevel: randomSkill,
      });
    }

    setPlayers(newPlayers);
  };

  const handlePlayerClick = (player: Player) => {
    if (player.isCurrentUser) return; // Don't show profile for current user
    
    setSelectedPlayer({
      name: player.name,
      username: player.name.toLowerCase().replace(' ', '_'),
      userId: 'SP2025-' + Math.floor(Math.random() * 10000),
      rating: player.rating || 4.5,
      isVerified: player.verified,
      gamesPlayed: Math.floor(Math.random() * 50) + 10,
      reliabilityScore: Math.floor(Math.random() * 20) + 80,
      achievements: ['Team Player', 'Active Member'],
    });
  };

  const handleReady = () => {
    if (!userReady) {
      setUserReady(true);
      setReadyCount(prev => prev + 1);
      setPlayers(prev => prev.map(p => 
        p.isCurrentUser ? { ...p, ready: true } : p
      ));
      toast.success('You are ready! All other players will be ready in 4 seconds...');
    } else {
      setUserReady(false);
      setAllReadyMessage(false);
      setReadyCount(prev => Math.max(0, prev - 1));
      setPlayers(prev => prev.map(p => 
        p.isCurrentUser ? { ...p, ready: false } : p
      ));
      toast.info('You are no longer ready');
    }
  };

  // HOST: Start the game
  const handleStartGame = () => {
    setHostStarting(true);
    toast.success('🎮 Starting the game...');
    
    setTimeout(() => {
      setGameState('active');
      setHostStarting(false);
      toast.success('Game is now active! Click "Finish Game" when done.');
    }, 1500);
  };

  // HOST: Finish the game
  const handleFinishGame = () => {
    toast.success('Game finished! Enter the final score.');
    setGameState('host-score-entry');
  };

  // HOST: Submit score
  const handleHostSubmitScore = () => {
    if (!team1Score || !team2Score) {
      toast.error('Please enter scores for both teams');
      return;
    }
    
    toast.info('Score submitted! Players are voting...');
    setGameState('vote-score');
    setHasUserVoted(false);
    setUserVote(null);

    // Auto-approve votes
    let approveCount = 0;
    const voteInterval = setInterval(() => {
      approveCount++;
      setVotesApproved(approveCount);
      if (approveCount >= players.length) {
        clearInterval(voteInterval);
        setTimeout(() => {
          setGameState('mvp-vote');
          setVotesApproved(0);
          setVotesDisapproved(0);
          toast.success('Score approved! Vote for the MVP...');
        }, 1000);
      }
    }, 400);
  };

  const handleKickPlayer = (playerId: string, playerName: string) => {
    setKickingPlayerId(playerId);
    setTimeout(() => {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
      setReadyCount(prev => {
        const player = players.find(p => p.id === playerId);
        return player?.ready ? Math.max(0, prev - 1) : prev;
      });
      toast.success(`${playerName} has been kicked from the game`);
      setKickingPlayerId(null);
    }, 500);
  };

  const handleInviteTeamMember = (member: TeamMember) => {
    if (!member.online) {
      toast.error(`${member.name} is offline`);
      return;
    }
    setInvitedMembers(prev => new Set([...prev, member.id]));
    toast.success(`Invitation sent to ${member.name}!`);
  };

  const handleLeaveGame = () => {
    if (gameData) {
      setShowLeaveConfirmModal(false);
      setUserReady(false);
      setPlayers([]);
      setReadyCount(0);
      setChatMessages([]);
      onLeaveGame?.(gameData.id);
      onGameComplete?.();
      onBack();
      toast.success('You have left the game');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      playerId: 'current-user',
      playerName: 'You',
      message: newMessage.trim(),
      timestamp: Date.now(),
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent!');
  };

  const handleVoteScore = (vote: 'approve' | 'disagree') => {
    setUserVote(vote);
    setHasUserVoted(true);
    
    if (vote === 'approve') {
      setVotesApproved(prev => prev + 1);
      toast.success('You approved the score!');
    } else {
      setVotesDisapproved(prev => prev + 1);
      toast.info('You disagree with the score. You will need to enter the correct score.');
      
      setTimeout(() => {
        setVotesDisapproved(players.length - 1);
        toast.warning('Majority disagrees! Need to re-enter score...');
        setGameState('rescore');
      }, 1500);
    }
  };

  const handleRescore = () => {
    if (!team1Score || !team2Score) {
      toast.error('Please enter correct scores for both teams');
      return;
    }
    
    setVotesApproved(0);
    setVotesDisapproved(0);
    setHasUserVoted(false);
    setUserVote(null);
    setGameState('revote-score');
    toast.info('New score submitted. Players are voting again...');

    let approveCount = 0;
    const voteInterval = setInterval(() => {
      approveCount++;
      setVotesApproved(approveCount);
      if (approveCount >= Math.ceil(players.length * 0.7)) {
        clearInterval(voteInterval);
        setTimeout(() => {
          setGameState('mvp-vote');
          setVotesApproved(0);
          setVotesDisapproved(0);
          setHasUserVoted(false);
          setUserVote(null);
          toast.success('Score approved! Vote for the MVP...');
        }, 1000);
      }
    }, 400);
  };

  const handleVoteMvp = (player: Player) => {
    setHasVotedMvp(true);
    setMvpVotes(prev => ({ ...prev, [player.id]: (prev[player.id] || 0) + 1 }));
    toast.success('MVP vote cast!');
    
    // Simulate other players voting after 2 seconds
    setTimeout(() => {
      const simulatedVotes: {[playerId: string]: number} = {};
      players.forEach(p => {
        // Give current user (id: 'current-user') the most votes regardless of who was tapped
        simulatedVotes[p.id] = p.isCurrentUser ? players.length - 1 : Math.floor(Math.random() * 2);
      });
      setMvpVotes(simulatedVotes);
      setShowMvpReveal(true);
    }, 2000);
  };

  const handleRatePlayer = () => {
    const currentPlayer = players[currentRatingIndex];
    const rating = playerRatings[currentPlayer.id] || 0;

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    toast.success(`Rated ${currentPlayer.name} - ${rating} stars`);
    
    if (currentRatingIndex < players.length - 1) {
      setCurrentRatingIndex(prev => prev + 1);
    } else {
      setGameState('rewards');
    }
  };

  const handleSubmitReport = () => {
    if (selectedReportReasons.length === 0) {
      toast.error('Please select at least one reason');
      return;
    }
    toast.success('Report submitted successfully');
    setShowReportModal(false);
    setSelectedReportReasons([]);
    setReportComment('');
  };

  const handleReturnToMenu = () => {
    // Clear all game data and leave the game
    if (gameData) {
      onLeaveGame?.(gameData.id);
    }
    setChatMessages([]);
    setPlayers([]);
    setReadyCount(0);
    setUserReady(false);
    onGameComplete?.();
    onBack();
    toast.success('You can now join another game!');
  };

  const handleSwitchTeam = () => {
    if (userReady) {
      toast.error('Cannot switch teams after readying up');
      return;
    }
    setUserTeam(userTeam === 1 ? 2 : 1);
    toast.success(`Switched to Team ${userTeam === 1 ? 2 : 1}`);
  };

  const toggleReportReason = (reason: string) => {
    setSelectedReportReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const getSkillBadgeColor = (skill?: string) => {
    switch (skill) {
      case 'Casual':
        return 'bg-blue-100 text-blue-700';
      case 'Novice':
        return 'bg-purple-100 text-purple-700';
      case 'Elite':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const teamAPlayers = players.filter(p => p.team === 1);
  const teamBPlayers = players.filter(p => p.team === 2);
  const gameLat = gameData?.latitude || 37.7749;
  const gameLng = gameData?.longitude || -122.4194;

  // HOST: Score Entry Screen
  if (isHost && gameState === 'host-score-entry') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Enter Final Score</h1>
          <p className="text-white/80 text-sm">What was the final score?</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-gray-900 font-bold text-xl mb-2 text-center">Game Finished!</h2>
              <p className="text-gray-600 text-sm text-center mb-6">Enter the final score below:</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-semibold mb-2 block">Team 1 Score</label>
                  <Input
                    type="number"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    placeholder="Enter score"
                    className="rounded-xl h-12 text-lg text-center"
                  />
                </div>

                <div className="flex items-center justify-center py-4">
                  <div className="text-4xl font-bold text-gray-400">vs</div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 font-semibold mb-2 block">Team 2 Score</label>
                  <Input
                    type="number"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    placeholder="Enter score"
                    className="rounded-xl h-12 text-lg text-center"
                  />
                </div>
              </div>

              <Button
                onClick={handleHostSubmitScore}
                className="w-full mt-8 rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Submit Score
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // HOST: Active Game Screen
  if (isHost && gameState === 'active') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-blue-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Game Active 🎮</h1>
          <p className="text-white/80 text-sm">Game is in progress...</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Play className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-gray-900 font-bold text-2xl mb-2">Game in Progress</h2>
            <p className="text-gray-600 mb-8">Players: {players.length}</p>
            
            <Button
              onClick={handleFinishGame}
              className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Finish Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showRewardScreen && gameState === 'rewards') {
    const points = 50;
    const reliability = 5;

    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Rewards Earned!</h1>
          <p className="text-white/80 text-sm">Great game! Here's what you earned</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-8">
          <div className="pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
              <div className="mb-8 animate-bounce">
                <Gift className="w-20 h-20 text-yellow-500 mx-auto" />
              </div>
              
              <h2 className="text-gray-900 font-bold text-2xl mb-8">Game Complete!</h2>
              
              <div className="space-y-4 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <p className="text-sm text-blue-700 font-semibold mb-2">Points Earned</p>
                  <p className="text-4xl font-bold text-blue-600">+{points}</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                  <p className="text-sm text-green-700 font-semibold mb-2">Reliability Score</p>
                  <p className="text-4xl font-bold text-green-600">+{reliability}%</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200 mb-8">
                <p className="text-sm text-gray-700 mb-2">Total Rewards This Game:</p>
                <p className="text-lg font-bold text-gray-900">🏆 {points} Points + 👥 {reliability}% Reliability</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    const cert: Certificate = {
                      id: `cert-${Date.now()}`,
                      gameId: gameData?.id || 'unknown',
                      sport: gameData?.sport || 'Unknown',
                      gameName: gameData?.title || 'Game',
                      venue: gameData?.location || 'Unknown Venue',
                      date: gameData?.date || new Date().toISOString(),
                      pointsEarned: points,
                      playerName: 'Player Name', // This will be updated from currentUser in real implementation
                    };
                    setCurrentCertificate(cert);
                    setShowCertificateView(true);
                  }}
                  className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  📜 View Certificate
                </Button>
                <Button
                  onClick={() => setShowShareModal(true)}
                  className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  Share after game
                </Button>
                <Button
                  onClick={handleReturnToMenu}
                  className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (gameState === 'vote-score') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Score Voting</h1>
          <p className="text-white/80 text-sm">{isHost ? 'Players are voting...' : 'Do you agree with this score?'}</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-8">
          <div className="pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-gray-900 font-bold text-xl mb-2">Score Confirmation</h2>
              <p className="text-gray-600 mb-6 text-2xl font-bold">Team 1: {team1Score} vs Team 2: {team2Score}</p>
              
              {!isHost && !hasUserVoted && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    onClick={() => handleVoteScore('approve')}
                    className="rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Agree
                  </Button>
                  <Button
                    onClick={() => handleVoteScore('disagree')}
                    className="rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Disagree
                  </Button>
                </div>
              )}

              {votesDisapproved > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 font-semibold mb-3">Votes Against:</p>
                  <p className="text-lg font-bold text-red-600">{votesDisapproved}/{players.length}</p>
                </div>
              )}

              {votesApproved > 0 && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 font-semibold mb-3">Votes For:</p>
                  <p className="text-lg font-bold text-green-600">{votesApproved}/{players.length}</p>
                </div>
              )}

              {userVote === 'disagree' && votesDisapproved >= Math.ceil(players.length * 0.6) && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700 font-semibold">✓ Majority disagrees. You will enter the correct score next.</p>
                </div>
              )}

              {isHost && votesApproved < players.length && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700 font-semibold">⏳ Waiting for player votes...</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (gameState === 'rescore') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Re-enter Score</h1>
          <p className="text-white/80 text-sm">What was the correct final score?</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-gray-900 font-bold text-xl mb-2 text-center">Correct Final Score</h2>
              <p className="text-gray-600 text-sm text-center mb-6">Majority disagreed with the score. Please enter the correct score:</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-semibold mb-2 block">Team 1 Score</label>
                  <Input
                    type="number"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    placeholder="Enter score"
                    className="rounded-xl h-12 text-lg text-center"
                  />
                </div>

                <div className="flex items-center justify-center py-4">
                  <div className="text-4xl font-bold text-gray-400">vs</div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 font-semibold mb-2 block">Team 2 Score</label>
                  <Input
                    type="number"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    placeholder="Enter score"
                    className="rounded-xl h-12 text-lg text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <Button
                  onClick={() => setGameState('vote-score')}
                  variant="outline"
                  className="rounded-2xl py-3 font-semibold border-gray-300"
                >
                  Back
                </Button>
                <Button
                  onClick={handleRescore}
                  className="rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Submit Score
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (gameState === 'revote-score') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Final Score Vote</h1>
          <p className="text-white/80 text-sm">New score submitted - voting again...</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-gray-900 font-bold text-xl mb-2">Final Score Confirmation</h2>
            <p className="text-gray-600 mb-6 text-2xl font-bold">Team 1: {team1Score} vs Team 2: {team2Score}</p>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 font-semibold mb-3">Players Approving:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {players.map((player, index) => (
                  <div key={player.id} className="flex flex-col items-center gap-1">
                    <Badge
                      className={`px-3 py-1.5 text-xs font-semibold ${index < votesApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {player.name}
                    </Badge>
                    <Badge className={`${getSkillBadgeColor(player.skillLevel)} text-xs font-semibold px-2 py-0.5`}>
                      {player.skillLevel}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-lg font-bold text-green-600">{votesApproved}/{players.length} Approved</p>
            
            {votesApproved >= Math.ceil(players.length * 0.7) && (
              <p className="text-sm text-green-600 font-semibold mt-4">✓ Score confirmed! Moving to rating...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MVP VOTING STATE
  if (gameState === 'mvp-vote') {
    if (!showMvpReveal) {
      // STEP 1: Player voting
      return (
        <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 pt-8 pb-8 px-6 rounded-b-3xl">
            <h1 className="text-white text-2xl font-bold">Vote for MVP</h1>
            <p className="text-white/90 text-sm">Who was the best player this game?</p>
          </div>

          <ScrollArea className="flex-1 px-6 py-8">
            <div className="space-y-3 pb-32">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleVoteMvp(player)}
                  disabled={hasVotedMvp}
                  className={`w-full bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4 transition-all hover:shadow-xl ${
                    hasVotedMvp ? 'opacity-60' : 'hover:scale-105'
                  } ${!hasVotedMvp ? 'cursor-pointer' : ''}`}
                >
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-bold text-lg">
                      {player.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <h3 className="text-gray-900 font-semibold text-lg">{player.name}</h3>
                  </div>
                  <Badge className={`${getSkillBadgeColor(player.skillLevel)} text-xs font-semibold px-3 py-1`}>\n                    {player.skillLevel}\n                  </Badge>\n                </button>\n              ))}\n            </div>\n          </ScrollArea>\n        </div>\n      );\n    } else {\n      // STEP 2: MVP Reveal\n      const currentUser = players.find(p => p.isCurrentUser);\n      const mvpVotesCopy = Object.entries(mvpVotes).sort(([, a], [, b]) => b - a);\n      \n      return (\n        <div className=\"h-screen w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 flex flex-col\">\n          <div className=\"bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 pt-8 pb-8 px-6 rounded-b-3xl\">\n            <h1 className=\"text-white text-2xl font-bold text-center\">🏆 MVP Reveal</h1>\n          </div>\n\n          <ScrollArea className=\"flex-1 px-6 py-8\">\n            <div className=\"pb-32\">\n              {/* Animated MVP Reveal */}\n              <div className=\"text-center bg-white rounded-3xl shadow-2xl p-8 mb-6\">\n                <div className=\"animate-bounce mb-4 inline-block\">\n                  <Crown className=\"w-16 h-16 text-yellow-500\" fill=\"currentColor\" />\n                </div>\n                <h2 className=\"text-gray-900 font-bold text-3xl mb-2\">MVP of the Game!</h2>\n                <div className=\"bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-4\">\n                  <p className=\"text-gray-900 font-bold text-2xl\">YOU</p>\n                  <p className=\"text-gray-600 text-sm mt-1\">Voted by {players.length - 1} players</p>\n                </div>\n                <div className=\"bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-3 inline-block font-bold text-lg mb-6\">\n                  +50 BONUS MVP POINTS\n                </div>\n                <p className=\"text-gray-600 text-sm mb-4\">You've been voted the MVP! Great game!</p>\n              </div>\n\n              {/* Vote Breakdown */}\n              <div className=\"bg-white rounded-2xl shadow-lg p-6 mb-6\">\n                <h3 className=\"text-gray-900 font-bold text-lg mb-4\">Vote Breakdown</h3>\n                <div className=\"space-y-3\">\n                  {mvpVotesCopy.map(([playerId, votes]) => {\n                    const votedPlayer = players.find(p => p.id === playerId);\n                    return (\n                      <div key={playerId} className=\"flex items-center justify-between\">\n                        <span className=\"text-gray-900 font-semibold\">{votedPlayer?.name}</span>\n                        <Badge className=\"bg-yellow-100 text-yellow-700 font-bold\">{votes} votes</Badge>\n                      </div>\n                    );\n                  })}\n                </div>\n              </div>\n            </div>\n          </ScrollArea>\n\n          {/* Action Button */}\n          <div className=\"px-6 py-4 bg-white border-t border-gray-200\">\n            <Button\n              onClick={() => {\n                addPoints(50);\n                setGameState('rating');\n                setCurrentRatingIndex(0);\n                setHasVotedMvp(false);\n                setShowMvpReveal(false);\n                setMvpVotes({});\n                toast.success('Moving to player ratings...');\n              }}\n              className=\"w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600\"\n            >\n              Continue to Ratings\n            </Button>\n          </div>\n        </div>\n      );\n    }\n  }

  if (gameState === 'rating') {
    const currentPlayer = players[currentRatingIndex];
    const ratedCount = Object.keys(playerRatings).length;
    const currentRating = playerRatings[currentPlayer.id] || 0;
    const currentComment = playerComments[currentPlayer.id] || '';

    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Rate Players</h1>
          <p className="text-white/80 text-sm">Progress: {ratedCount}/{players.length}</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-8">
          <div className="pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full text-center">
              <Avatar className="size-20 mx-auto mb-4">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-2xl font-bold">
                  {currentPlayer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-gray-900 font-bold text-2xl mb-2">{currentPlayer.name}</h2>
              <Badge className={`${getSkillBadgeColor(currentPlayer.skillLevel)} text-xs font-semibold px-3 py-1 inline-block mb-4`}>
                {currentPlayer.skillLevel}
              </Badge>
              <p className="text-gray-600 mb-6">How did they play?</p>

              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setPlayerRatings(prev => ({ ...prev, [currentPlayer.id]: star }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>

              <div className="mb-6 text-left">
                <label className="text-sm text-gray-600 font-semibold mb-2 block">Add a comment (optional)</label>
                <textarea
                  value={currentComment}
                  onChange={(e) => setPlayerComments(prev => ({ ...prev, [currentPlayer.id]: e.target.value }))}
                  placeholder="Why did you give this rating? E.g., Great teamwork, Good defense, Could improve..."
                  className="w-full rounded-xl p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none h-20"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setPlayerRatings(prev => ({ ...prev, [currentPlayer.id]: 0 }));
                    setPlayerComments(prev => ({ ...prev, [currentPlayer.id]: '' }));
                  }}
                  variant="outline"
                  className="flex-1 rounded-2xl py-3 font-semibold border-gray-300"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => setShowReportModal(true)}
                  variant="outline"
                  className="flex-1 rounded-2xl py-3 font-semibold border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report
                </Button>
                <Button
                  onClick={handleRatePlayer}
                  className="flex-1 rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  Submit
                </Button>
              </div>

              {currentRatingIndex < players.length - 1 && (
                <p className="text-sm text-gray-500 mt-4">
                  {players.length - currentRatingIndex - 1} more to rate
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end max-w-md mx-auto z-50">
            <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">Report {currentPlayer.name}</h3>
                  <Badge className={`${getSkillBadgeColor(currentPlayer.skillLevel)} text-xs font-semibold px-2 py-0.5 mt-1`}>
                    {currentPlayer.skillLevel}
                  </Badge>
                </div>
                <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 font-semibold mb-3">What happened? (Select all that apply)</p>
                <div className="space-y-2">
                  {reportReasonsArray.map((reason) => (
                    <label key={reason} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedReportReasons.includes(reason)}
                        onChange={() => toggleReportReason(reason)}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 font-semibold mb-2 block">Additional details (optional)</label>
                <textarea
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="Provide more context about your report..."
                  className="w-full rounded-xl p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none h-20"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowReportModal(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl py-3 font-semibold border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReport}
                  className="flex-1 rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex items-center justify-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Submit Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-blue-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Game Complete!</h1>
          <p className="text-white/80 text-sm">Thanks for playing</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-gray-900 font-bold text-2xl mb-2">Game Finished!</h2>
            <p className="text-gray-600 mb-2">Final Score: {team1Score} - {team2Score}</p>
            <p className="text-gray-600 text-sm mb-8">All players rated successfully</p>
            <p className="text-gray-500 text-xs mb-6">💬 Group chat will be deleted shortly</p>

            <Button
              onClick={handleReturnToMenu}
              className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-2xl font-bold">My Queue</h1>
              <p className="text-white/80 text-sm">Active game</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Users className="size-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">No Active Games</h3>
            <p className="text-sm text-gray-600">Create or join a game to see it here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-24">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl hover:bg-white/30 transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">{gameData.title}</h1>
            <p className="text-white/80 text-sm">{gameData.sport}</p>
          </div>
          {isHost && (
            <Badge className="bg-purple-400 text-purple-900 font-semibold text-xs px-2.5 py-1 flex-shrink-0">
              Host
            </Badge>
          )}
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowMapModal(true)} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{gameData.location}</span>
              </button>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{gameData.time}</span>
              </div>
            </div>
            <Badge className="bg-yellow-400 text-yellow-900 font-semibold text-xs px-3 py-1">
              {readyCount}/{players.length} Ready
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 mt-6">
        <div className="space-y-4 pb-40">
          {/* Player Count Pill */}
          <div className="flex justify-center">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {players.length} / {gameData?.maxPlayers || 10} players
            </div>
          </div>

          {/* Game Full Banner */}
          {players.length >= (gameData?.maxPlayers || 10) && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-orange-900 font-bold text-sm">Game is full — waiting for host to start</p>
                </div>
              </div>
            </div>
          )}
          
          {isHost && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium text-sm">You're the host! All players will be ready in 4 seconds.</p>
                  <p className="text-purple-600 text-xs mt-1 font-semibold">{readyCount}/{players.length} players ready</p>
                </div>
              </div>
            </div>
          )}

          {!isHost && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium text-sm">Click 'I'm Ready!' when you're prepared to play</p>
                  <p className="text-blue-600 text-xs mt-1 font-semibold">{readyCount}/{players.length} players ready</p>
                </div>
              </div>
            </div>
          )}

          {allReadyMessage && readyCount === players.length && gameState === 'waiting' && (
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-green-900 font-bold text-sm">✓ All players ready!</p>
                  {isHost ? (
                    <p className="text-green-700 text-xs mt-1 font-semibold">🎮 Click "Start Game" to begin!</p>
                  ) : (
                    <p className="text-green-700 text-xs mt-1 font-semibold">🎮 Host is starting the game...</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {hostStarting && !isHost && (
            <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-4 animate-bounce">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Play className="w-5 h-5 text-purple-600 animate-spin" />
                </div>
                <div>
                  <p className="text-purple-900 font-bold text-sm">🚀 Starting Game...</p>
                  <p className="text-purple-700 text-xs mt-1 font-semibold">Get ready!</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => setShowMapModal(true)} variant="outline" className="rounded-2xl py-3 font-semibold border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-center gap-2">
                <Map className="w-5 h-5" />
                Location
              </Button>
              <Button onClick={() => setShowGroupChat(true)} variant="outline" className="rounded-2xl py-3 font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2 relative">
                <MessageCircle className="w-5 h-5" />
                Chat
                {chatMessages.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {chatMessages.length > 9 ? '9+' : chatMessages.length}
                  </span>
                )}
              </Button>
            </div>

            <Button onClick={() => setShowInviteModal(true)} variant="outline" className="w-full rounded-2xl py-3 font-semibold border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite Team Members
            </Button>

            {!isHost && !allReadyMessage && (
              <Button onClick={handleSwitchTeam} disabled={userReady} variant="outline" className="w-full rounded-2xl py-3 font-semibold border-gray-300">
                Switch Team
              </Button>
            )}

            {isHost && allReadyMessage ? (
              <Button 
                onClick={handleStartGame} 
                disabled={hostStarting}
                className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
              >
                {hostStarting ? '🚀 Starting...' : '🎮 Start Game'}
              </Button>
            ) : !isHost && (
              <Button onClick={handleReady} disabled={hostStarting} className={`w-full rounded-2xl py-3 font-semibold text-white ${userReady ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'} disabled:opacity-50`}>
                {userReady ? '✓ Ready - Starting soon...' : "I'm Ready!"}
              </Button>
            )}

            <Button onClick={() => setShowLeaveConfirmModal(true)} variant="outline" className="w-full rounded-2xl py-3 font-semibold border-red-200 text-red-600 hover:bg-red-50">
              Leave Game
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <h3 className="text-gray-900 font-semibold">Team 1</h3>
              </div>
              <span className="text-gray-600 text-sm font-medium">{teamAPlayers.length} players</span>
            </div>
            <div className="space-y-2">
              {teamAPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  disabled={player.isCurrentUser}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    player.isCurrentUser 
                      ? 'bg-blue-50 border border-blue-200 cursor-default' 
                      : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  } ${kickingPlayerId === player.id ? 'opacity-50' : ''}`}
                >
                  <Avatar className="size-9 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xs font-semibold">
                      {player.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium truncate">{player.name}</p>
                    <Badge className={`${getSkillBadgeColor(player.skillLevel)} text-xs font-semibold mt-1`}>
                      {player.skillLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {player.isCurrentUser ? (
                      <Badge className="bg-blue-600 text-white text-xs">You</Badge>
                    ) : player.ready ? (
                      <Badge className="bg-green-100 text-green-700 text-xs font-semibold">Ready</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 text-xs font-semibold">Waiting</Badge>
                    )}
                    {isHost && !player.isCurrentUser && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKickPlayer(player.id, player.name);
                        }}
                        disabled={kickingPlayerId === player.id}
                        className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50"
                        title="Kick player"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <h3 className="text-gray-900 font-semibold">Team 2</h3>
              </div>
              <span className="text-gray-600 text-sm font-medium">{teamBPlayers.length} players</span>
            </div>
            <div className="space-y-2">
              {teamBPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  disabled={player.isCurrentUser}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    player.isCurrentUser 
                      ? 'bg-blue-50 border border-blue-200 cursor-default' 
                      : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  } ${kickingPlayerId === player.id ? 'opacity-50' : ''}`}
                >
                  <Avatar className="size-9 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-semibold">
                      {player.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium truncate">{player.name}</p>
                    <Badge className={`${getSkillBadgeColor(player.skillLevel)} text-xs font-semibold mt-1`}>
                      {player.skillLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {player.isCurrentUser ? (
                      <Badge className="bg-blue-600 text-white text-xs">You</Badge>
                    ) : player.ready ? (
                      <Badge className="bg-green-100 text-green-700 text-xs font-semibold">Ready</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 text-xs font-semibold">Waiting</Badge>
                    )}
                    {isHost && !player.isCurrentUser && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKickPlayer(player.id, player.name);
                        }}
                        disabled={kickingPlayerId === player.id}
                        className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50"
                        title="Kick player"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {showLeaveConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center max-w-md mx-auto z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 mx-4">
            <h3 className="text-gray-900 font-bold text-lg mb-2">Leave Game?</h3>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to leave this game? You won't be able to rejoin.</p>
            <div className="flex gap-3">
              <Button onClick={() => setShowLeaveConfirmModal(false)} variant="outline" className="flex-1 rounded-2xl py-3 font-semibold border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleLeaveGame} className="flex-1 rounded-2xl py-3 font-semibold text-white bg-red-600 hover:bg-red-700">
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}

      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end max-w-md mx-auto z-50">
          <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-gray-900 font-bold text-lg">Game Location</h3>
                <p className="text-sm text-gray-600 mt-1">{gameData.location}</p>
              </div>
              <button onClick={() => setShowMapModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.openstreetmap.org/export/embed.html?bbox=${gameLng - 0.01},${gameLat - 0.01},${gameLng + 0.01},${gameLat + 0.01}&layer=mapnik&marker=${gameLat},${gameLng}`} allowFullScreen />
            </div>
            <div className="p-6 border-t">
              <a href={`https://www.google.com/maps/search/?api=1&query=${gameLat},${gameLng}`} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 rounded-2xl font-semibold transition-colors">
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}

      {showGroupChat && (
        <div className="fixed inset-0 bg-black/50 flex items-end max-w-md mx-auto z-50">
          <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <div>
                <h3 className="text-gray-900 font-bold text-lg">Game Chat</h3>
                <p className="text-sm text-gray-600 mt-1">Discuss meetup details</p>
              </div>
              <button onClick={() => setShowGroupChat(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-3 pb-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.playerId === 'current-user' ? 'justify-end' : ''}`}>
                    {msg.playerId !== 'current-user' && (
                      <Avatar className="size-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-semibold">
                          {msg.playerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-xs ${msg.playerId === 'current-user' ? 'bg-blue-600 text-white rounded-3xl rounded-tr-none' : 'bg-gray-100 text-gray-900 rounded-3xl rounded-tl-none'} px-4 py-2.5`}>
                      {msg.playerId !== 'current-user' && <p className="text-xs font-semibold mb-1 opacity-70">{msg.playerName}</p>}
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.playerId === 'current-user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-4 sticky bottom-0 bg-white">
              <div className="flex gap-2">
                <Input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="rounded-2xl px-4 py-2.5 flex-1" />
                <Button onClick={handleSendMessage} className="rounded-2xl px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">💬 This chat will be deleted after the game</p>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end max-w-md mx-auto z-50">
          <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-gray-900 font-bold text-lg">Invite Team Members</h3>
                <p className="text-sm text-gray-600 mt-1">Send invites to your team</p>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-2">
                {mockTeamMembers.map((member) => {
                  const isInvited = invitedMembers.has(member.id);
                  return (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Avatar className="size-10 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-900 font-medium truncate">{member.name}</p>
                          {member.online && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                        </div>
                        <Badge className={`${member.skillLevel === 'Casual' ? 'bg-blue-100 text-blue-700' : member.skillLevel === 'Novice' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'} text-xs font-semibold mt-1`}>
                          {member.skillLevel}
                        </Badge>
                      </div>
                      <button onClick={() => handleInviteTeamMember(member)} disabled={!member.online || isInvited} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isInvited ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'} ${isInvited ? 'animate-pulse' : ''}`}>
                        {isInvited ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-6 border-t">
              <Button onClick={() => setShowInviteModal(false)} variant="outline" className="w-full rounded-2xl py-3 font-semibold">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Profile Card */}
      {selectedPlayer && (
        <MiniProfileCard
          user={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onViewFullProfile={() => {
            setSelectedPlayer(null);
            // Can add navigation to full profile if needed
            toast.info('Full profile view coming soon!');
          }}
        />
      )}

      {/* Certificate View Overlay */}
      {showCertificateView && currentCertificate && (
        <CertificateView
          certificate={currentCertificate}
          onClose={() => {
            setShowCertificateView(false);
            setCurrentCertificate(null);
          }}
        />
      )}

      {/* Share Game Modal */}
      {showShareModal && (
        <ShareGameModal
          gameData={gameData}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}