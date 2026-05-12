document.addEventListener('DOMContentLoaded', () => {
    const threadsView = document.getElementById('threads-view');
    const singleThreadView = document.getElementById('single-thread-view');
    const threadsList = document.getElementById('threads-list');
    const newThreadBtn = document.getElementById('new-thread-btn');
    const newThreadForm = document.getElementById('new-thread-form');
    const cancelThreadBtn = document.getElementById('cancel-thread-btn');
    const submitThreadBtn = document.getElementById('submit-thread-btn');
    const backToThreadsBtn = document.getElementById('back-to-threads-btn');
    const threadContentContainer = document.getElementById('thread-content-container');
    const commentsList = document.getElementById('comments-list');
    const submitCommentBtn = document.getElementById('submit-comment-btn');
    
    let currentThreadId = null;

    // Load all threads initially
    loadThreads();

    // Toggle new thread form
    newThreadBtn.addEventListener('click', () => {
        const userStr = localStorage.getItem('gotravel_user');
        if (!userStr) {
            customAlert('Please sign in or register to post a thread.');
            openLogin();
            return;
        }
        newThreadForm.style.display = 'block';
    });

    cancelThreadBtn.addEventListener('click', () => {
        newThreadForm.style.display = 'none';
        document.getElementById('thread-title').value = '';
        document.getElementById('thread-content').value = '';
    });

    // Create a new thread
    submitThreadBtn.addEventListener('click', async () => {
        const userStr = localStorage.getItem('gotravel_user');
        if (!userStr) {
            customAlert('Please sign in or register to post a thread.');
            openLogin();
            return;
        }
        const user = JSON.parse(userStr);

        const title = document.getElementById('thread-title').value.trim();
        const content = document.getElementById('thread-content').value.trim();

        if (!title || !content) {
            alert("Please enter both title and content.");
            return;
        }

        try {
            const res = await fetch('/api/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    user_name: user.name,
                    user_email: user.email
                })
            });

            if (res.ok) {
                newThreadForm.style.display = 'none';
                document.getElementById('thread-title').value = '';
                document.getElementById('thread-content').value = '';
                loadThreads();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create thread.");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred.");
        }
    });

    // Back button
    backToThreadsBtn.addEventListener('click', () => {
        singleThreadView.style.display = 'none';
        threadsView.style.display = 'block';
        currentThreadId = null;
        loadThreads();
    });

    // Create a comment
    submitCommentBtn.addEventListener('click', async () => {
        const userStr = localStorage.getItem('gotravel_user');
        if (!userStr) {
            customAlert('Please sign in or register to comment.');
            openLogin();
            return;
        }
        const user = JSON.parse(userStr);

        if (!currentThreadId) return;

        const content = document.getElementById('comment-content').value.trim();
        if (!content) {
            alert("Please enter a comment.");
            return;
        }

        try {
            const res = await fetch(`/api/threads/${currentThreadId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content,
                    user_name: user.name,
                    user_email: user.email
                })
            });

            if (res.ok) {
                document.getElementById('comment-content').value = '';
                loadThread(currentThreadId);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to post comment.");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred.");
        }
    });

    // Functions to fetch and render
    async function loadThreads() {
        try {
            const res = await fetch('/api/threads');
            const data = await res.json();
            
            threadsList.innerHTML = '';
            if (data.threads && data.threads.length > 0) {
                data.threads.forEach(thread => {
                    const date = new Date(thread.created_at).toLocaleString();
                    const el = document.createElement('div');
                    el.className = 'forum-thread-card';
                    el.innerHTML = `
                        <div class="forum-thread-info">
                            <h3 class="forum-thread-title">${escapeHTML(thread.title)}</h3>
                            <p class="forum-thread-meta">Started by <strong>${escapeHTML(thread.user_name)}</strong> on ${date}</p>
                        </div>
                        <div class="forum-thread-stats">
                            <span class="forum-comment-count"><i class="fa-regular fa-comment"></i> ${thread.comment_count}</span>
                        </div>
                    `;
                    el.addEventListener('click', () => {
                        loadThread(thread.id);
                    });
                    threadsList.appendChild(el);
                });
            } else {
                threadsList.innerHTML = '<p style="text-align:center; padding: 30px; color: var(--text-light);">No threads yet. Be the first to start a conversation!</p>';
            }
        } catch (e) {
            console.error(e);
            threadsList.innerHTML = '<p style="text-align:center; padding: 30px; color: red;">Failed to load threads.</p>';
        }
    }

    async function loadThread(id) {
        try {
            const res = await fetch(`/api/threads/${id}`);
            const data = await res.json();
            
            if (res.ok) {
                currentThreadId = id;
                threadsView.style.display = 'none';
                singleThreadView.style.display = 'block';
                
                // Render thread
                const t = data.thread;
                const tDate = new Date(t.created_at).toLocaleString();
                threadContentContainer.innerHTML = `
                    <h2 style="margin-bottom: 10px; color: var(--text-dark);">${escapeHTML(t.title)}</h2>
                    <div style="font-size: 13px; color: var(--text-light); margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border);">
                        Posted by <strong>${escapeHTML(t.user_name)}</strong> on ${tDate}
                    </div>
                    <div style="line-height: 1.6; font-size: 15px; white-space: pre-wrap; color: var(--text-dark);">${escapeHTML(t.content)}</div>
                `;
                
                // Render comments
                commentsList.innerHTML = '';
                if (data.comments && data.comments.length > 0) {
                    data.comments.forEach(c => {
                        const cDate = new Date(c.created_at).toLocaleString();
                        const el = document.createElement('div');
                        el.className = 'forum-comment-card';
                        el.innerHTML = `
                            <div class="forum-comment-meta"><strong>${escapeHTML(c.user_name)}</strong> <span style="color: var(--text-light); font-size: 12px; margin-left: 10px;">${cDate}</span></div>
                            <div class="forum-comment-body">${escapeHTML(c.content)}</div>
                        `;
                        commentsList.appendChild(el);
                    });
                } else {
                    commentsList.innerHTML = '<p style="color: var(--text-light); font-style: italic; padding: 10px 0;">No comments yet.</p>';
                }
                
            } else {
                alert(data.error || "Failed to load thread.");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred.");
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
    }
});
