export interface ElectionPhase {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'active' | 'upcoming';
  icon: string;
}

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export const ELECTION_DATA = {
  id: 'india-general-2024',
  country: 'India',
  type: 'General Election',
  year: 2024,
  officialWebsite: 'https://eci.gov.in',
  phases: [
    {
      id: 'voter-registration',
      title: 'Voter Registration',
      description: 'Ensure you are registered in the electoral roll.',
      startDate: '2024-01-01',
      endDate: '2024-03-15',
      status: 'completed',
      icon: 'UserPlus',
    },
    {
      id: 'nomination-filing',
      title: 'Candidate Nominations',
      description: 'Candidates file their nomination papers.',
      startDate: '2024-03-20',
      endDate: '2024-04-05',
      status: 'completed',
      icon: 'FileText',
    },
    {
      id: 'campaigning',
      title: 'Election Campaigning',
      description: 'Political parties and candidates campaign for votes.',
      startDate: '2024-04-10',
      endDate: '2024-05-30',
      status: 'active',
      icon: 'Megaphone',
    },
    {
      id: 'polling-days',
      title: 'Polling Days',
      description: 'Multi-phase voting across the country.',
      startDate: '2024-04-19',
      endDate: '2024-06-01',
      status: 'active',
      icon: 'Vote',
    },
    {
      id: 'results-day',
      title: 'Counting & Results',
      description: 'Votes are counted and results are announced.',
      startDate: '2024-06-04',
      endDate: '2024-06-04',
      status: 'upcoming',
      icon: 'Trophy',
    },
  ] as ElectionPhase[],
  guides: [
    {
      id: 'how-to-register',
      title: 'How to Register',
      description: 'A step-by-step guide to becoming a registered voter.',
      icon: 'ClipboardCheck',
    },
    {
      id: 'find-polling-station',
      title: 'Find Your Polling Station',
      description: 'Locate where you need to go on election day.',
      icon: 'MapPin',
    },
    {
      id: 'voting-day-process',
      title: 'Voting Day Process',
      description: 'What to expect inside the polling booth.',
      icon: 'CheckCircle',
    },
  ] as GuideStep[],
  faqs: [
    {
      question: 'Can I vote without a Voter ID card?',
      answer:
        'Yes, you can vote if your name is in the electoral roll and you carry one of the 12 alternative photo identity documents approved by the ECI.',
      category: 'Voting',
    },
    {
      question: 'How do I check my name in the voter list?',
      answer:
        'You can check your name on the Electoral Search portal (voters.eci.gov.in) using your EPIC number or personal details.',
      category: 'Registration',
    },
    {
      question: 'What is NOTA?',
      answer:
        'NOTA (None of the Above) is an option on the EVM that allows a voter to officially register a vote of rejection for all candidates.',
      category: 'General',
    },
  ] as FAQ[],
};
