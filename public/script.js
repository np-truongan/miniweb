async function fetchPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    
    const list = document.getElementById('post-list');
    list.innerHTML = posts.map(post => `<li>${post.title}</li>`).join('');
}

fetchPosts();