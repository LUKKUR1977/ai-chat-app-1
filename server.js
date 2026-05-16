const http = require('http');

const server = http.createServer((req, res) => {

  // ===== UI =====
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
      <h1>🚀 Moja aplikacja AI</h1>

      <button onclick="loadUsers()">Users</button>
      <button onclick="loadTasks()">Tasks</button>

      <br/><br/>

      <input id="aiInput" placeholder="Napisz do AI..." />
      <button onclick="askAI()">Ask AI</button>

      <pre id="output"></pre>

      <script>
        async function loadUsers(){
          const res = await fetch('/api/users');
          const data = await res.json();
          document.getElementById('output').textContent =
            JSON.stringify(data,null,2);
        }

        async function loadTasks(){
          const res = await fetch('/api/tasks');
          const data = await res.json();
          document.getElementById('output').textContent =
            JSON.stringify(data,null,2);
        }

        async function askAI(){
          const q = document.getElementById('aiInput').value;
          const res = await fetch('/api/ai?q=' + encodeURIComponent(q));
          const data = await res.json();
          document.getElementById('output').textContent =
            JSON.stringify(data,null,2);
        }
      </script>
    `);
  }

  // ===== USERS =====
  else if (req.url === '/api/users') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([
      { id:1, name:'Lukasz' },
      { id:2, name:'AI User' }
    ]));
  }

  // ===== TASKS =====
  else if (req.url === '/api/tasks') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([
      { id:1, title:'Zbudować AI system' },
      { id:2, title:'Użyć Dockera jak pro' }
    ]));
  }

  // ===== AI (OLLAMA) =====
  else if (req.url.startsWith('/api/ai')) {
    res.setHeader('Content-Type', 'application/json');

    const url = new URL(req.url, 'http://localhost');
    const prompt = url.searchParams.get('q') || '';

    const data = JSON.stringify({
      model: "llama3",
      prompt: prompt,
      stream: false
    });

    const options = {
      hostname: 'host.docker.internal',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const ollamaReq = require('http').request(options, (ollamaRes) => {
      let body = '';

      ollamaRes.on('data', chunk => body += chunk);

      ollamaRes.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          res.end(JSON.stringify({
            answer: parsed.response
          }));
        } catch {
          res.end(JSON.stringify({
            error: 'Błąd AI'
          }));
        }
      });
    });

    ollamaReq.on('error', () => {
      res.end(JSON.stringify({
        error: 'Brak połączenia z Ollama'
      }));
    });

    ollamaReq.write(data);
    ollamaReq.end();
  }

});

server.listen(3000, () => {
  console.log("🚀 Server działa");
});
