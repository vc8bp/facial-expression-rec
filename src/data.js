export let statusData = {
    default: { emoji: '😐', color: '#02c19c', rating: 0 },
    neutral: { emoji: '😐', color: '#54adad', rating: 0 },
    happy: { emoji: '😀', color: '#148f77', rating: 3 },
    sad: { emoji: '😥', color: '#767e7e', rating: -3 },
    angry: { emoji: '😠', color: '#b64518', rating: -5 },
    fearful: { emoji: '😨', color: '#90931d', rating: -4 },
    disgusted: { emoji: '🤢', color: '#1a8d1a', rating: -2 },
    surprised: { emoji: '😲', color: '#1230ce', rating: 2 },
};

export let ratingToData = {
    0: { emotion: "neutral", emoji: '😐', color: "#54adad" },
    3: { emotion: "happy", emoji: '😀', color: "#148f77" },
    '-3': { emotion: "sad", emoji: '😥', color: "#767e7e" },
    '-5': { emotion: "angry", emoji: '😠', color: "#b64518" },
    '-4': { emotion: "fearful", emoji: '😨', color: "#90931d" },
    '-2': { emotion: "disgusted", emoji: '🤢', color: "#1a8d1a" },
    2: { emotion: "surprised", emoji: '😲', color: "#1230ce" },
};
