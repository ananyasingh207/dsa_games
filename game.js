
const container = document.getElementById('gameContainer');

function showGame(id) {
  const views = {
    sorting: sortingView,
    floodfill: floodFillView,
    bst: bstView,
    linked: linkedListView,
    paren: parenView,
  };
  container.innerHTML = views[id]();
  if (id === 'sorting') bootSorting();
  if (id === 'floodfill') bootFloodFill();
  if (id === 'bst') bootBST();
  if (id === 'linked') bootLinkedList();
  if (id === 'paren') bootParen();
}

/* ----------------------------------------
   Sorting Race
-----------------------------------------*/
function sortingView() {
  return `
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-2xl font-bold text-[rgb(49,81,30)]">Sorting Race</h2>
      <p class="text-[rgb(26,26,25)] mb-4">Watch Bubble, Selection, and Insertion sort the same array.</p>

      <div class="flex flex-wrap gap-3 items-end">
        <label class="text-sm text-[rgb(26,26,25)]">Size:
          <input id="sortSize" type="number" min="5" max="120" value="30"
                 class="ml-1 w-20 px-2 py-1 border border-[rgb(26,26,25)] rounded bg-[rgb(240,240,240)]" /> 
        </label>
        <label class="text-sm text-[rgb(26,26,25)]">Delay (ms):
          <input id="sortDelay" type="number" min="10" max="1000" value="80"
                 class="ml-1 w-24 px-2 py-1 border border-[rgb(26,26,25)] rounded bg-[rgb(240,240,240)]" /> 
        </label>
        <button id="genArray" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Generate Array</button> 
        <select id="algo" class="px-2 py-2 border border-[rgb(26,26,25)] rounded bg-[rgb(240,240,240)] text-[rgb(26,26,25)]"> 
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
        </select>
        <button id="startSort" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Start</button> 
        <span id="sortStatus" class="text-lg font-bold text-[rgb(26,26,25)] ml-auto"></span>
      </div>

      <div class="mt-6">
        <div id="bars" class="h-[280px] flex items-end gap-[2px] border border-[rgb(26,26,25)] rounded p-2 overflow-hidden"></div>
      </div>

      <pre class="mt-4 bg-[rgb(240,240,240)] p-3 rounded text-sm text-[rgb(26,26,25)] overflow-x-auto"> 
<b>Algorithm (Bubble Sort):</b>
- Repeatedly step through the list
- Compare adjacent elements and swap if they are in the wrong order
- Pass through the list multiple times until no swaps are needed

<b>Algorithm (Selection Sort):</b>
- Find the minimum element in the unsorted array
- Swap it with the first unsorted element
- Repeat for the remaining unsorted array

<b>Algorithm (Insertion Sort):</b>
- Start with the first element (already “sorted”).
- Take the next element and place it in the correct spot among the already sorted ones.
- Keep doing this until all elements are placed correctly.
      </pre>
    </div>
  `;
}

function bootSorting() {
  const barsEl = document.getElementById('bars');
  const sizeEl = document.getElementById('sortSize');
  const delayEl = document.getElementById('sortDelay');
  const statusEl = document.getElementById('sortStatus');
  const algoEl = document.getElementById('algo');
  let arr = [];

  function drawBars(a, highlight = [], sortedIndex = -1) {
    barsEl.innerHTML = '';
    const max = Math.max(...a);
    a.forEach((v, i) => {
      const bar = document.createElement('div');
      bar.style.height = `${(v / max) * 100}%`;
      bar.style.width = `${Math.max(6, Math.floor(600 / a.length))}px`;
      bar.className = 'bg-sky-500 transition-all'; 
      if (highlight.includes(i)) bar.className = 'bg-amber-400';
      if (i <= sortedIndex) bar.className = 'bg-emerald-500'; 
      barsEl.appendChild(bar);
    });
  }

  function genArray() {
    const n = Math.max(5, Math.min(120, +sizeEl.value || 30));
    arr = Array.from({ length: n }, () => Math.floor(Math.random() * 99) + 1);
    drawBars(arr);
    statusEl.textContent = `Array of ${n} generated`;
  }

  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function bubbleSort(a) {
    const delay = Math.max(10, +delayEl.value || 80);
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        drawBars(a, [j, j + 1], a.length - i);
        await sleep(delay);
        if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
    drawBars(a, [], a.length);
  }

  async function selectionSort(a) {
    const delay = Math.max(10, +delayEl.value || 80);
    for (let i = 0; i < a.length; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) {
        drawBars(a, [min, j], i - 1);
        await sleep(delay);
        if (a[j] < a[min]) min = j;
      }
      if (min !== i) [a[i], a[min]] = [a[min], a[i]];
      drawBars(a, [], i);
    }
    drawBars(a, [], a.length);
  }

  async function insertionSort(a) {
    const delay = Math.max(10, +delayEl.value || 80);
    for (let i = 1; i < a.length; i++) {
      let key = a[i], j = i - 1;
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        drawBars(a, [j, j + 1], i - 1);
        await sleep(delay);
        j--;
      }
      a[j + 1] = key;
      drawBars(a, [], i);
      await sleep(delay);
    }
    drawBars(a, [], a.length);
  }

  document.getElementById('genArray').onclick = genArray;
  document.getElementById('startSort').onclick = async () => {
    if (!arr.length) genArray();
    const a = arr.slice();
    statusEl.textContent = 'Sorting...';
    const algo = algoEl.value;
    if (algo === 'bubble') await bubbleSort(a);
    if (algo === 'selection') await selectionSort(a);
    if (algo === 'insertion') await insertionSort(a);
    statusEl.textContent = 'Done 🎉';
  };

  genArray();
}

/* ----------------------------------------
   Flood Fill Puzzle (BFS)
-----------------------------------------*/
function floodFillView() {
  return `
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-2xl font-bold text-[rgb(49,81,30)]">Flood Fill Puzzle</h2>
      <p class="text-[rgb(26,26,25)] mb-4">Click a cell to fill connected cells with a new color using BFS. Goal: Fill the grid in the fewest moves.</p>

      <div class="flex flex-wrap gap-3 items-end mb-4">
        <label class="text-sm text-[rgb(26,26,25)]">Select Color:
          <select id="fillColor" class="border border-[rgb(26,26,25)] rounded px-2 py-1 ml-2 bg-[rgb(240,240,240)] text-[rgb(26,26,25)]"> 
            <option value="0">Red</option>
            <option value="1">Blue</option>
            <option value="2">Green</option>
            <option value="3">Yellow</option>
          </select>
        </label>
        <button id="resetGrid" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Reset Grid</button>
        <span id="moveCount" class="text-lg font-bold text-[rgb(26,26,25)] ml-auto">Moves: 0</span>
        <span id="gameStatus" class="text-lg font-bold text-[rgb(26,26,25)] ml-2"></span>
      </div>

      <div class="border border-[rgb(26,26,25)] rounded p-4 bg-[rgb(246,252,223,0)]">
        <div id="grid" class="grid grid-cols-10 gap-[1px] w-full max-w-[min(90vw,90vh)] aspect-square mx-auto"></div>
      </div>

      <pre class="mt-4 bg-[rgb(240,240,240)] p-3 rounded text-sm text-[rgb(26,26,25)] overflow-x-auto">
<b>Algorithm (Flood Fill with BFS):</b>
- Start from the clicked cell and enqueue it
- While queue is not empty:
  - Remove (dequeue) the first cell.
  - Change its color to the new color.
  - Check its four neighbors (up, down, left, right).
  - If a neighbor has the old color, add it to the queue.
- Keep doing this until no connected cells with the old color are left.
      </pre>
    </div>
  `;
}

function bootFloodFill() {
  const ROWS = 10, COLS = 10, COLORS = 4;
  const COLORS_MAP = {
    0: 'bg-red-500', 
    1: 'bg-blue-500', 
    2: 'bg-green-500', 
    3: 'bg-yellow-500' 
  };
  let grid = [];
  let moves = 0;

  function initGrid() {
    grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => Math.floor(Math.random() * COLORS))
    );
    moves = 0;
    render();
    updateStatus();
  }

  function render() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';
    grid.forEach((row, i) => {
      row.forEach((color, j) => {
        const cell = document.createElement('div');
        cell.className = `w-9 h-9 ${COLORS_MAP[color]} cursor-pointer`; 
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.onclick = () => handleCellClick(i, j);
        gridEl.appendChild(cell);
      });
    });
    document.getElementById('moveCount').textContent = `Moves: ${moves}`;
  }

  async function handleCellClick(i, j) {
    const newColor = +document.getElementById('fillColor').value;
    const oldColor = grid[i][j];
    if (newColor === oldColor) return;

    await floodFill(i, j, oldColor, newColor);
    moves++;
    render();
    updateStatus();
  }

  async function floodFill(i, j, oldColor, newColor) {
    if (grid[i][j] !== oldColor || grid[i][j] === newColor) return;

    const queue = [[i, j]];
    const visited = new Set();
    visited.add(`${i},${j}`);
    grid[i][j] = newColor;

    while (queue.length) {
      const [r, c] = queue.shift();
      const neighbors = [
        [r-1, c], [r+1, c], [r, c-1], [r, c+1]
      ].filter(([nr, nc]) => nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS);

      for (const [nr, nc] of neighbors) {
        if (!visited.has(`${nr},${nc}`) && grid[nr][nc] === oldColor) {
          visited.add(`${nr},${nc}`);
          grid[nr][nc] = newColor;
          queue.push([nr, nc]);
          render(); 
          await new Promise(r => setTimeout(r, 50)); // 50ms delay for animation
        }
      }
    }
  }

  function isGridFilled() {
    const firstColor = grid[0][0];
    return grid.every(row => row.every(cell => cell === firstColor));
  }

  function updateStatus() {
    const statusEl = document.getElementById('gameStatus');
    if (isGridFilled()) {
      statusEl.textContent = `🎉 Grid filled in ${moves} moves!`;
      statusEl.className = 'text-lg font-bold text-[rgb(26,26,25)] ml-2';
    } else {
      statusEl.textContent = '';
      statusEl.className = 'text-lg font-bold text-[rgb(26,26,25)] ml-2';
    }
  }

  document.getElementById('resetGrid').onclick = initGrid;

  initGrid();
}

/* ----------------------------------------
   BST Visualizer (insert + search + draw)
-----------------------------------------*/
function bstView() {
  return `
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-2xl font-bold text-[rgb(49,81,30)]">BST Visualizer</h2>
      <p class="text-[rgb(26,26,25)] mb-4">Insert numbers, search values, and see the tree drawn.</p>

      <div class="flex flex-wrap gap-2 items-end">
        <input id="bstValue" type="number" placeholder="Value" class="border border-[rgb(26,26,25)] rounded px-2 py-1 w-28 bg-[rgb(240,240,240)] text-[rgb(26,26,25)]" /> 
        <button id="bstInsert" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Insert</button> 
        <input id="bstSearchVal" type="number" placeholder="Search" class="border border-[rgb(26,26,25)] rounded px-2 py-1 w-28 ml-2 bg-[rgb(240,240,240)] text-[rgb(26,26,25)]" /> 
        <button id="bstSearch" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Search</button> 
        <span id="bstStatus" class="text-lg font-bold text-[rgb(26,26,25)] ml-auto"></span>
      </div>

      <div class="mt-4 flex gap-4 text-sm text-[rgb(26,26,25)]">
        <div>Inorder: <span id="bstInorder" class="font-mono"></span></div>
        <div>Preorder: <span id="bstPreorder" class="font-mono"></span></div>
        <div>Postorder: <span id="bstPostorder" class="font-mono"></span></div>
      </div>

      <div class="mt-6 overflow-x-auto">
        <svg id="bstCanvas" class="bg-[rgb(246,252,223,0)] border border-[rgb(26,26,25)] rounded"></svg>
      </div>

      <pre class="mt-4 bg-[rgb(240,240,240)] p-3 rounded text-sm text-[rgb(26,26,25)] overflow-x-auto"> 
<b>Algorithm (Insert):</b>
- Start from the root node.
- Compare the value to insert with the current node’s value:
  - If smaller, move to the left child.
  - If greater or equal, move to the right child.
- Repeat until you find a null child (empty spot).
- Insert the new value there.

<b>Algorithm (Search):</b>
- Start from the root node.
- Compare the target value with the current node’s value:
  - If equal, you found it.
  - If smaller, go to the left child.
  - If greater, go to the right child.
- If you reach a null child, the value is not found.
      </pre>
    </div>
  `;
}

function bootBST() {
  class Node { constructor(v){ this.v=v; this.l=null; this.r=null; } }
  class BST {
    constructor(){ this.root=null; }
    insert(v){
      if(!this.root){ this.root=new Node(v); return; }
      let cur=this.root;
      while(true){
        if(v===cur.v) return; 
        if(v<cur.v){ if(!cur.l){ cur.l=new Node(v); return; } cur=cur.l; }
        else { if(!cur.r){ cur.r=new Node(v); return; } cur=cur.r; }
      }
    }
    inorder(n=this.root, out=[]){ if(!n) return out; this.inorder(n.l,out); out.push(n.v); this.inorder(n.r,out); return out; }
    preorder(n=this.root, out=[]){ if(!n) return out; out.push(n.v); this.preorder(n.l,out); this.preorder(n.r,out); return out; }
    postorder(n=this.root, out=[]){ if(!n) return out; this.postorder(n.l,out); this.postorder(n.r,out); out.push(n.v); return out; }
    search(x){
      let cur=this.root, path=[];
      while(cur){ path.push(cur.v); if(x===cur.v) return {found:true,path}; cur=x<cur.v?cur.l:cur.r; }
      return {found:false,path};
    }
    depth(n=this.root){
      if (!n) return 0;
      return 1 + Math.max(this.depth(n.l), this.depth(n.r));
    }
    nodeCount(n=this.root){
      if (!n) return 0;
      return 1 + this.nodeCount(n.l) + this.nodeCount(n.r);
    }
    layout(){
      const nodes=[], edges=[];
      let idx=0;
      function dfs(n,depth,xMap){
        if(!n) return;
        dfs(n.l, depth+1, xMap);
        const x = (idx++)*45 + 40;
        const y = depth*80 + 40;
        nodes.push({v:n.v,x,y});
        xMap.set(n, {x,y});
        dfs(n.r, depth+1, xMap);
      }
      const map=new Map();
      dfs(this.root,0,map);
      function walk(n){
        if(!n) return;
        if(n.l) edges.push([map.get(n), map.get(n.l)]);
        if(n.r) edges.push([map.get(n), map.get(n.r)]);
        walk(n.l); walk(n.r);
      }
      walk(this.root);
      return {nodes,edges};
    }
  }

  const bst = new BST();
  const cvs = document.getElementById('bstCanvas');
  const status = document.getElementById('bstStatus');

  function draw() {
    const depth = bst.depth();
    const nodeCount = bst.nodeCount();
    const width = Math.max(1200, nodeCount * 45 + 80);
    const height = Math.max(380, depth * 80 + 80);
    cvs.setAttribute('width', width);
    cvs.setAttribute('height', height);

    cvs.innerHTML = '';
    const {nodes, edges} = bst.layout();

    // edges
    edges.forEach(([a,b])=>{
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      line.setAttribute('stroke', 'rgb(26,26,25)');
      line.setAttribute('stroke-width','2');
      cvs.appendChild(line);
    });

    // nodes
    nodes.forEach(n=>{
      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r','18');
      c.setAttribute('fill','rgb(246,252,223)');
      c.setAttribute('stroke','rgb(26,26,25)');
      c.setAttribute('stroke-width','2');
      const t = document.createElementNS('http://www.w3.org/2000/svg','text');
      t.setAttribute('x', n.x); t.setAttribute('y', n.y+4);
      t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('fill','rgb(26,26,25)');
      t.textContent = n.v;
      g.appendChild(c); g.appendChild(t);
      cvs.appendChild(g);
    });

    // traversals
    document.getElementById('bstInorder').textContent = bst.inorder().join(', ');
    document.getElementById('bstPreorder').textContent = bst.preorder().join(', ');
    document.getElementById('bstPostorder').textContent = bst.postorder().join(', ');
  }

  // seed
  [10,6,15,3,8,13,20,2,5,7,9,18,25].forEach(v=>bst.insert(v));
  draw();

  document.getElementById('bstInsert').onclick = () => {
    const v = +document.getElementById('bstValue').value;
    if (Number.isFinite(v)) { bst.insert(v); draw(); status.textContent = `Inserted ${v}`; }
  };
  document.getElementById('bstSearch').onclick = () => {
    const v = +document.getElementById('bstSearchVal').value;
    if (!Number.isFinite(v)) return;
    const res = bst.search(v);
    status.textContent = res.found ? `Found ${v} via path: ${res.path.join(' → ')}` :
                                     `Not found. Path tried: ${res.path.join(' → ')}`;
  };
}

/* ----------------------------------------
   Linked List Visualizer
-----------------------------------------*/
function linkedListView() {
  return `
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-2xl font-bold text-[rgb(49,81,30)]">Linked List Visualizer</h2>
      <p class="text-[rgb(26,26,25)] mb-4">Append/Prepend/Delete & watch nodes update.</p>

      <div class="flex flex-wrap gap-2 items-end">
        <input id="llVal" type="text" placeholder="Value" class="border border-[rgb(26,26,25)] rounded px-2 py-1 w-32 bg-[rgb(240,240,240)] text-[rgb(26,26,25)]" /> 
        <button id="llAppend" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Append</button> 
        <button id="llPrepend" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Prepend</button> 
        <button id="llDelHead" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Delete Head</button> 
        <button id="llDelTail" class="px-3 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Delete Tail</button> 
        <span id="llStatus" class="text-lg font-bold text-[rgb(26,26,25)] ml-auto"></span>
      </div>

      <div id="llCanvas" class="mt-6 border border-[rgb(26,26,25)] rounded p-4 overflow-x-auto bg-[rgb(246,252,223,0)]">
        <div id="llLine" class="flex items-center gap-3 min-w-max"></div>
      </div>

      <pre class="mt-4 bg-[rgb(240,240,240)] p-3 rounded text-sm text-[rgb(26,26,25)] overflow-x-auto"> 
<b>Algorithm for Append (Add at End):</b>
- Create a new node with the given value.
- If the list is empty → Set both head and tail to the new node.
- Otherwise → Link the current tail to the new node, then update tail to this new node

<b>Algorithm for Prepend (Add at Start):</b>
- Create a new node with the given value.
- If the list is empty → Set both head and tail to the new node.
- Otherwise → Point newNode.next to the current head, then update head to this new node.

<b>Algorithm for Delete Head:</b>
- If the list is empty → Nothing to delete.
- Set head to head.next.
- If list becomes empty after deletion → Set tail to null.
 - 
<b>Algorithm for Delete Tail:</b>
- If the list is empty → Nothing to delete.
- Traverse to the second last node.
- Set its next to null and update tail to this node.
- If there was only one node → Set both head and tail to null.
      </pre>
    </div>
  `;
}

function bootLinkedList() {
  class Node { constructor(v){ this.v=v; this.n=null; } }
  class LinkedList {
    constructor(){ this.h=null; this.t=null; }
    append(v){
      const nd=new Node(v);
      if(!this.h){ this.h=this.t=nd; } else { this.t.n=nd; this.t=nd; }
    }
    prepend(v){
      const nd=new Node(v);
      if(!this.h){ this.h=this.t=nd; } else { nd.n=this.h; this.h=nd; }
    }
    delHead(){ if(!this.h) return; this.h=this.h.n; if(!this.h) this.t=null; }
    delTail(){
      if(!this.h) return;
      if(this.h===this.t){ this.h=this.t=null; return; }
      let p=this.h; while(p.n && p.n!==this.t) p=p.n; p.n=null; this.t=p;
    }
    toArray(){ const a=[]; let p=this.h; while(p){ a.push(p.v); p=p.n; } return a; }
  }

  const list = new LinkedList();
  // seed
  ['A','B','C','D'].forEach(v=>list.append(v));

  const line = document.getElementById('llLine');
  const status = document.getElementById('llStatus');

  function render() {
    line.innerHTML = '';
    let p = list.h;
    if (!p) {
      line.innerHTML = `<div class="text-[rgb(26,26,25)]">Empty list</div>`;
      return;
    }
    while (p) {
      const box = document.createElement('div');
      box.className = 'px-4 py-3 rounded-xl bg-[rgb(246,252,223)] border border-[rgb(26,26,25)] text-[rgb(26,26,25)]';
      box.textContent = p.v;
      line.appendChild(box);

      if (p.n) {
        const arrow = document.createElement('div');
        arrow.className = 'text-[rgb(26,26,25)] select-none';
        arrow.textContent = '→';
        line.appendChild(arrow);
      } else {
        const nullTag = document.createElement('div');
        nullTag.className = 'text-[rgb(26,26,25)] text-sm select-none';
        nullTag.textContent = '∅';
        line.appendChild(nullTag);
      }
      p = p.n;
    }
  }

  document.getElementById('llAppend').onclick = () => {
    const v = document.getElementById('llVal').value.trim();
    if (!v) return;
    list.append(v); render(); status.textContent = `Appended "${v}"`;
  };
  document.getElementById('llPrepend').onclick = () => {
    const v = document.getElementById('llVal').value.trim();
    if (!v) return;
    list.prepend(v); render(); status.textContent = `Prepended "${v}"`;
  };
  document.getElementById('llDelHead').onclick = () => { list.delHead(); render(); status.textContent = 'Deleted head'; };
  document.getElementById('llDelTail').onclick = () => { list.delTail(); render(); status.textContent = 'Deleted tail'; };

  render();
}

/* ----------------------------------------
   Parenthesis Matcher (Stack)
-----------------------------------------*/
function parenView() {
  return `
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-2xl font-bold text-[rgb(49,81,30)]">Parenthesis Matcher</h2>
      <p class="text-[rgb(26,26,25)] mb-4">Enter an expression — we’ll check if it's balanced using a stack.</p>

      <div class="flex gap-2">
        <input id="parenInput" class="border border-[rgb(26,26,25)] rounded px-3 py-2 flex-1 bg-[rgb(240,240,240)] text-[rgb(26,26,25)]"
               placeholder="e.g. (a+b) * {[c-(d/e)]}" /> 
        <button id="parenCheck" class="px-4 py-2 rounded bg-[rgb(26,26,25)] text-[rgb(255,255,255)]">Check</button> 
      </div>
      <p id="parenResult" class="mt-3 text-lg font-bold text-[rgb(26,26,25)]"></p>

      <pre class="mt-4 bg-[rgb(240,240,240)] p-3 rounded text-sm text-[rgb(26,26,25)] overflow-x-auto"> 
<b>Algorithm:</b>
- Push opening brackets ((, {, [) onto a stack.
- When a closing bracket (), }, ]) is found:
  - Pop the top element from the stack.
  - Check if it matches the correct type of opening bracket.
- After traversal:
  - If the stack is empty → Balanced.
  - If not empty → Unbalanced.
      </pre>
    </div>
  `;
}

function bootParen() {
  function isBalanced(s) {
    const st = [];
    const match = {')':'(',']':'[','}':'{'};
    for (const ch of s) {
      if (ch==='('||ch==='['||ch==='{') st.push(ch);
      else if (ch===')'||ch===']'||ch==='}') {
        if (st.pop() !== match[ch]) return false;
      }
    }
    return st.length === 0;
  }

  document.getElementById('parenCheck').onclick = () => {
    const s = document.getElementById('parenInput').value || '';
    const ok = isBalanced(s);
    const res = document.getElementById('parenResult');
    res.textContent = ok ? '✅ Balanced' : '❌ Not Balanced';
    res.className = `mt-3 text-lg font-bold ${ok ? 'text-[rgb(26,26,25)]' : 'text-[rgb(26,26,25)]'}`;
  };
}

