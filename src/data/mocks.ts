// ─── Types ───────────────────────────────────────────────────────────────────

export type Video = {
  id: string;
  author: string;
  username: string;
  description: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  gradientColors: [string, string];
  musicName: string;
  avatar: string;
};

export type Notification = {
  id: string;
  type: 'like' | 'follow' | 'mention' | 'dm';
  user: string;
  text: string;
  time: string;
  avatarColor: string;
};

export type Message = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
};

export type Category = {
  id: string;
  label: string;
  emoji: string;
  color: string;
};

// ─── Videos ──────────────────────────────────────────────────────────────────

export const VIDEOS: Video[] = [
  {
    id: 'v1',
    author: 'María Rodríguez',
    username: '@mariafit_ec',
    description: 'Rutina de 10 minutos que cambió mi vida · No necesitas gimnasio para estar en forma',
    hashtags: ['#fitness', '#workout', '#ecuador', '#saludable'],
    likes: 48200,
    comments: 1340,
    shares: 892,
    saves: 3400,
    gradientColors: ['#FE2C55', '#FF7B54'],
    musicName: 'Shakira - Bzrp Music Sessions #53',
    avatar: '#FE2C55',
  },
  {
    id: 'v2',
    author: 'Carlos Mendez',
    username: '@carlosgamer_col',
    description: 'Cuando llevas 3 horas en ranked y esto pasa · La lag no tiene perdón',
    hashtags: ['#gaming', '#valorant', '#latam', '#gamer'],
    likes: 124500,
    comments: 8920,
    shares: 5600,
    saves: 12000,
    gradientColors: ['#25F4EE', '#0066CC'],
    musicName: 'Feid - CHORIZO ASADO',
    avatar: '#25F4EE',
  },
  {
    id: 'v3',
    author: 'Valentina Torres',
    username: '@vale.cocina',
    description: 'Ceviche tradicional en 5 minutos · Receta de mi abuela, patrimonio familiar',
    hashtags: ['#cocina', '#ceviche', '#ecuador', '#recetas'],
    likes: 67800,
    comments: 2100,
    shares: 4300,
    saves: 8900,
    gradientColors: ['#FFD700', '#FF8C00'],
    musicName: 'Bad Bunny - Un Verano Sin Ti',
    avatar: '#FFD700',
  },
  {
    id: 'v4',
    author: 'Diego Ramos',
    username: '@diegocomedy',
    description: 'POV: Cuando tu mamá dice "ahorita" en Ecuador · Todo latino lo entiende',
    hashtags: ['#comedia', '#latam', '#humor', '#pov'],
    likes: 203000,
    comments: 15600,
    shares: 28000,
    saves: 45000,
    gradientColors: ['#A855F7', '#6B21A8'],
    musicName: 'Ozuna - Monotonía ft. Shakira',
    avatar: '#A855F7',
  },
  {
    id: 'v5',
    author: 'Sofia Guerrero',
    username: '@sofiarte_mx',
    description: 'Pinté este cuadro en 60 segundos · Arte digital que nadie te enseña en la escuela',
    hashtags: ['#arte', '#digitalart', '#mexico', '#creatividad'],
    likes: 89100,
    comments: 3240,
    shares: 7800,
    saves: 15600,
    gradientColors: ['#10B981', '#059669'],
    musicName: 'Rosalía - BIZCOCHITO',
    avatar: '#10B981',
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like', user: 'carlos_gaming', text: 'le dio me gusta a tu video', time: 'hace 2 min', avatarColor: '#25F4EE' },
  { id: 'n2', type: 'follow', user: 'vale_cocina', text: 'empezó a seguirte', time: 'hace 5 min', avatarColor: '#FFD700' },
  { id: 'n3', type: 'mention', user: 'diegocomedy', text: 'te mencionó en un comentario', time: 'hace 12 min', avatarColor: '#A855F7' },
  { id: 'n4', type: 'like', user: 'sofiarte_mx', text: 'le dio me gusta a tu video', time: 'hace 18 min', avatarColor: '#10B981' },
  { id: 'n5', type: 'follow', user: 'mariafit_ec', text: 'empezó a seguirte', time: 'hace 25 min', avatarColor: '#FE2C55' },
  { id: 'n6', type: 'like', user: 'user_latam99', text: 'le dio me gusta a tu video', time: 'hace 1h', avatarColor: '#F97316' },
  { id: 'n7', type: 'mention', user: 'creador_bogota', text: 'te mencionó en su video', time: 'hace 2h', avatarColor: '#3B82F6' },
  { id: 'n8', type: 'like', user: 'tiktoker_lima', text: 'le dio me gusta a tu video', time: 'hace 3h', avatarColor: '#EC4899' },
  { id: 'n9', type: 'follow', user: 'gamer_mx_pro', text: 'empezó a seguirte', time: 'hace 4h', avatarColor: '#8B5CF6' },
  { id: 'n10', type: 'like', user: 'artista_quito', text: 'guardó tu video', time: 'hace 5h', avatarColor: '#14B8A6' },
];

// ─── Messages ─────────────────────────────────────────────────────────────────

export const DM_USER = { name: 'Carlos Gaming', username: '@carlosgamer_col', avatarColor: '#25F4EE' };

export const MESSAGES: Message[] = [
  { id: 'm1', text: '¡Bro ese video estuvo brutal!', fromMe: false, time: '10:24' },
  { id: 'm2', text: 'jajaja gracias, le metí mucho trabajo', fromMe: true, time: '10:25' },
  { id: 'm3', text: '¿Cuántas horas tardaste en editarlo?', fromMe: false, time: '10:25' },
  { id: 'm4', text: 'Como 3 horas nada más, el truco está en los cortes rápidos', fromMe: true, time: '10:26' },
  { id: 'm5', text: '¿Qué app usas para editar?', fromMe: false, time: '10:27' },
  { id: 'm6', text: 'CapCut, es gratis y hace maravillas', fromMe: true, time: '10:27' },
  { id: 'm7', text: 'A ver si me enseñas algún día', fromMe: false, time: '10:28' },
  { id: 'm8', text: '¡Claro! Hagamos una collab pronto', fromMe: true, time: '10:29' },
];

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'c1', label: 'Comedia', icon: 'happy-outline' as const, color: '#FE2C55' },
  { id: 'c2', label: 'Deportes', icon: 'football-outline' as const, color: '#25F4EE' },
  { id: 'c3', label: 'Gaming', icon: 'game-controller-outline' as const, color: '#A855F7' },
  { id: 'c4', label: 'Música', icon: 'musical-notes-outline' as const, color: '#FFD700' },
  { id: 'c5', label: 'Arte', icon: 'color-palette-outline' as const, color: '#10B981' },
  { id: 'c6', label: 'Cocina', icon: 'restaurant-outline' as const, color: '#F97316' },
];

// ─── Trending hashtags ────────────────────────────────────────────────────────

export const TRENDING = [
  { tag: '#comedia', views: '2.1M', color: '#FE2C55' },
  { tag: '#gaming', views: '1.8M', color: '#A855F7' },
  { tag: '#ecuador', views: '1.4M', color: '#FFD700' },
  { tag: '#latam', views: '980K', color: '#25F4EE' },
  { tag: '#cocina', views: '760K', color: '#F97316' },
  { tag: '#musica', views: '640K', color: '#10B981' },
];

// ─── Creator profile ──────────────────────────────────────────────────────────

export const MY_PROFILE = {
  name: 'Alex Creador',
  username: '@alex_creator_ec',
  bio: 'Creador de contenido | Ecuador | Entretenimiento & Lifestyle',
  following: 1240,
  followers: 8500,
  likes: 45200,
  avatarColor: '#FE2C55',
  goalsTarget: { followers: 10000, views: 100000 },
  goalsCurrent: { followers: 8500, views: 85000 },
};
