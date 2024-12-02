import { Globe, Book, Brain, Heart, Smile, Zap, Coffee, Compass, Star, Moon, Sun, Cloud } from 'lucide-react';

export const CULTURAL_LOCATIONS = [
  {
    title: 'Akihabara, Tokyo',
    anime: 'Steins;Gate',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800',
    description: 'El distrito electrónico y otaku más famoso de Japón.'
  },
  {
    title: 'Templo Kiyomizu-dera, Kyoto',
    anime: 'The Tale of the Princess Kaguya',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800',
    description: 'Templo histórico con vistas panorámicas de Kyoto.'
  },
  {
    title: 'Shibuya Crossing, Tokyo',
    anime: 'The Garden of Words',
    image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=800',
    description: 'El cruce peatonal más famoso del mundo, icónico en muchos animes.'
  },
  {
    title: 'Fushimi Inari Taisha, Kyoto',
    anime: 'Inari, Konkon, Koi Iroha',
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800',
    description: 'Santuario famoso por sus miles de torii rojos.'
  },
  {
    title: 'Monte Fuji',
    anime: 'Your Name',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800',
    description: 'La montaña más icónica de Japón, presente en innumerables animes.'
  },
  {
    title: 'Distrito Gion, Kyoto',
    anime: 'Memoirs of a Geisha',
    image: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=800',
    description: 'El distrito de geishas más famoso, inspiración para muchas historias.'
  },
  {
    title: 'Jardín Rikugien, Tokyo',
    anime: 'March Comes in Like a Lion',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800',
    description: 'Uno de los jardines más hermosos de Tokyo.'
  },
  {
    title: 'Asakusa, Tokyo',
    anime: 'Sarazanmai',
    image: 'https://images.unsplash.com/photo-1570521462033-3015e76e7432?auto=format&fit=crop&w=800',
    description: 'Distrito histórico con el famoso templo Senso-ji.'
  }
];

export const OTAKU_TERMS = [
  { term: 'Tsundere', definition: 'Personaje que inicialmente es frío o hostil pero gradualmente muestra su lado más cálido.' },
  { term: 'Isekai', definition: 'Género donde el protagonista es transportado a otro mundo.' },
  { term: 'Shounen', definition: 'Género dirigido principalmente a una audiencia masculina joven.' },
  { term: 'Moe', definition: 'Término que describe personajes que despiertan un sentimiento de ternura.' },
  { term: 'Slice of Life', definition: 'Género que retrata la vida cotidiana de los personajes.' },
  { term: 'Yandere', definition: 'Personaje que muestra un amor obsesivo y potencialmente violento.' },
  { term: 'Kuudere', definition: 'Personaje que parece frío e indiferente pero es cálido por dentro.' },
  { term: 'Dandere', definition: 'Personaje tímido que se abre gradualmente a otros.' },
  { term: 'Mecha', definition: 'Género que involucra robots gigantes pilotados.' },
  { term: 'Shoujo', definition: 'Género dirigido principalmente a una audiencia femenina joven.' },
  { term: 'Seinen', definition: 'Género dirigido a una audiencia masculina adulta.' },
  { term: 'Josei', definition: 'Género dirigido a una audiencia femenina adulta.' },
  { term: 'Chibi', definition: 'Estilo de dibujo donde los personajes son pequeños y adorables.' },
  { term: 'Nakama', definition: 'Amigos cercanos que son como familia.' },
  { term: 'Senpai', definition: 'Estudiante o trabajador con más experiencia.' },
  { term: 'Kohai', definition: 'Estudiante o trabajador con menos experiencia.' },
  { term: 'Mangaka', definition: 'Creador/a de manga.' },
  { term: 'OVA', definition: 'Original Video Animation, episodios especiales lanzados directamente en video.' },
  { term: 'Fanservice', definition: 'Contenido diseñado para agradar a los fans.' },
  { term: 'Otaku', definition: 'Persona con un gran interés en el anime y la cultura relacionada.' }
];

export const MOOD_RECOMMENDATIONS = {
  excited: {
    icon: Zap,
    genres: ['Action', 'Adventure'],
    themes: ['high energy', 'epic battles'],
    excludeThemes: ['slow paced', 'slice of life'],
    color: 'from-yellow-500 to-orange-500'
  },
  relaxed: {
    icon: Coffee,
    genres: ['Slice of Life', 'Comedy'],
    themes: ['healing', 'comfy'],
    excludeThemes: ['intense action', 'horror'],
    color: 'from-green-500 to-teal-500'
  },
  melancholic: {
    icon: Cloud,
    genres: ['Drama', 'Romance'],
    themes: ['emotional', 'character development'],
    excludeThemes: ['comedy', 'action heavy'],
    color: 'from-blue-500 to-indigo-500'
  },
  energetic: {
    icon: Sun,
    genres: ['Sports', 'Action'],
    themes: ['competition', 'training'],
    excludeThemes: ['slow paced', 'philosophical'],
    color: 'from-orange-500 to-red-500'
  },
  mysterious: {
    icon: Moon,
    genres: ['Mystery', 'Thriller', 'Psychological'],
    themes: ['suspense', 'plot twists'],
    excludeThemes: ['straightforward', 'comedy'],
    color: 'from-purple-500 to-violet-500'
  },
  adventurous: {
    icon: Compass,
    genres: ['Fantasy', 'Adventure'],
    themes: ['exploration', 'world building'],
    excludeThemes: ['slice of life', 'school life'],
    color: 'from-emerald-500 to-cyan-500'
  },
  thoughtful: {
    icon: Brain,
    genres: ['Psychological', 'Sci-Fi'],
    themes: ['philosophical', 'complex plot'],
    excludeThemes: ['simple plot', 'action focused'],
    color: 'from-indigo-500 to-purple-500'
  },
  romantic: {
    icon: Heart,
    genres: ['Romance', 'Drama'],
    themes: ['relationships', 'emotional growth'],
    excludeThemes: ['action heavy', 'horror'],
    color: 'from-pink-500 to-rose-500'
  }
};

export const EXPLORATION_TYPES = [
  { 
    id: 'emotional', 
    name: 'Explorador Emocional', 
    description: 'Descubre anime basado en tu estado de ánimo actual',
    icon: Heart,
    color: 'from-pink-500 to-red-500',
    bgImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800'
  },
  { 
    id: 'cultural', 
    name: 'Viaje Cultural', 
    description: 'Explora el trasfondo cultural del anime',
    icon: Globe,
    color: 'from-blue-500 to-indigo-500',
    bgImage: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800'
  },
  { 
    id: 'educational', 
    name: 'Diccionario Otaku', 
    description: 'Aprende términos y conceptos del anime',
    icon: Book,
    color: 'from-green-500 to-emerald-500',
    bgImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800'
  },
  { 
    id: 'ai-assistant', 
    name: 'SenpaiAI', 
    description: 'Tu asistente personal de anime',
    icon: Brain,
    color: 'from-purple-500 to-violet-500',
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800'
  }
];