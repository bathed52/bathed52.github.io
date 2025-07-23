const supabaseUrl = 'https://pjnzohwtjycuhrefbefn.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  loadEmojiCounts();
  loadMessages();
  bindEvents();
});

async function loadEmojiCounts() {
  try {
    const { data } = await supabase.from('reactions').select('*');
    data.forEach(item => {
      const btn = document.querySelector(`.emoji-btn[data-emoji="${item.emoji}"]`);
      if (btn) btn.querySelector('.count').textContent = item.count;
    });
  } catch (error) {
    console.error('加载表情计数失败:', error);
  }
}

async function loadMessages() {
  try {
    const { data } = await supabase.from('messages').select('*');
    const container = document.getElementById('messages-container');
    container.innerHTML = data.map(msg => `<div>${msg.content}</div>`).join('');
  } catch (error) {
    console.error('加载留言失败:', error);
  }
}

function bindEvents() {
  document.getElementById('send-message').addEventListener('click', async () => {
    const name = document.getElementById('name-input').value.trim();
    const content = document.getElementById('message-input').value.trim();
    if (!content) return alert('请输入祝福内容');
    try {
      await supabase.from('messages').insert([{ name, content }]);
      loadMessages();
    } catch (error) {
      console.error('发送留言失败:', error);
    }
  });
}