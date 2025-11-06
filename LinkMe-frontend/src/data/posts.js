// 简单的内存帖子数据模块，供 DiscoverPage 和 PostDetail 共享
export const recommendedPosts = [
  {
    id: 1,
    author: {
      name: 'babycat',
      handle: 'babycat',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg'
    },
    time: '15 minutes ago',
    location: 'Australia',
    caption: 'Beautiful cat in the world',
    hashtags: '#Cat #Pet #Animal',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg',
    likes: 1,
    favorites: 5,
    comments: [
      { id: 1, author: 'alice', text: 'So cute!' }
    ]
  },
  {
    id: 2,
    author: {
      name: 'Frank',
      handle: 'nbfrank',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg'
    },
    time: '4 hours ago',
    location: 'Stockholm',
    caption: 'Stockholm, Sweden',
    hashtags: '#Travel #Sweden #Stockholm',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg',
  likes: 24,
  favorites: 2,
    comments: []
  },
  {
    id: 3,
    author: {
      name: 'tu',
      handle: 'tu',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg'
    },
    time: '2 hours ago',
    location: 'Tokyo',
    caption: 'Amazing sunset in Tokyo',
    hashtags: '#Sunset #Tokyo #Japan',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg',
  likes: 156,
  favorites: 48,
    comments: []
  }
]

export const followingPosts = [
  {
    id: 4,
    author: {
      name: 'ha',
      handle: 'ha',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327753/aigp_1758963759.jpeg'
    },
    time: '1 hour ago',
    location: 'Paris',
    caption: 'Morning coffee in Paris',
    hashtags: '#Coffee #Paris #Morning',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327749/aigp_1758963751.jpeg',
  likes: 89,
  favorites: 10,
    comments: []
  },
  {
    id: 5,
    author: {
      name: 'Ck',
      handle: 'ck',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327748/aigp_1758963749.jpeg'
    },
    time: '30 minutes ago',
    location: 'New York',
    caption: 'Weekend vibes in the city',
    hashtags: '#Weekend #NYC #City',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327748/aigp_1758963749.jpeg',
  likes: 123,
  favorites: 32,
    comments: []
  },
  {
    id: 6,
    author: {
      name: 'pony',
      handle: 'pony',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327747/aigp_1758963748.jpeg'
    },
    time: '5 hours ago',
    location: 'London',
    caption: 'Nature walk in the park',
    hashtags: '#Nature #Walk #London',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327747/aigp_1758963748.jpeg',
  likes: 78,
  favorites: 7,
    comments: []
  }
]

// helper to find a post by id
export function findPostById(id) {
  const all = [...recommendedPosts, ...followingPosts]
  return all.find(p => p.id === Number(id)) || null
}
