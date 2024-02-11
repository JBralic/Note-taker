// DOM Elements
const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const noteList = document.querySelectorAll('.list-container .list-group');

// Active Note
let activeNote = {};

// Fetch Functions
const getNotes = () => fetch('/api/notes', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
const saveNote = (note) => fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(note) });
const deleteNote = (id) => fetch(`/api/notes/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });

// Display Functions
const show = (elem) => elem.style.display = 'inline';
const hide = (elem) => elem.style.display = 'none';

// Render Functions
const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const renderNoteList = async (notes) => {
  const jsonNotes = await notes.json();
  noteList.forEach(el => el.innerHTML = '');

  if (jsonNotes.length === 0) {
    noteList[0].innerHTML = '<li class="list-group-item">No saved Notes</li>';
  }

  jsonNotes.forEach(note => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.innerHTML = `<span class="list-item-title">${note.title}</span><i class="fas fa-trash-alt float-right text-danger delete-note"></i>`;
    liEl.setAttribute('data-note', JSON.stringify(note));
    noteList[0].append(liEl);
  });
};

// Event Handlers
const handleNoteSave = () => {
  const newNote = { title: noteTitle.value, text: noteText.value };
  saveNote(newNote)
      .then(getNotes) // Fetch notes after saving
      .then(renderNoteList) // Render the fetched notes
      .then(renderActiveNote);
};

const handleNoteDelete = (e) => {
  e.stopPropagation();
  const note = e.target.parentElement;
  const noteId = JSON.parse(note.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  const isNoteValid = noteTitle.value.trim() && noteText.value.trim();
  isNoteValid ? show(saveNoteBtn) : hide(saveNoteBtn);
};

// Event Listeners
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
  noteList[0].addEventListener('click', (e) => {
    if (e.target.matches('.list-item-title')) handleNoteView(e);
    if (e.target.matches('.delete-note')) handleNoteDelete(e);
  });
}

const getAndRenderNotes = () => getNotes().then(renderNoteList);

// Initial Load
getAndRenderNotes();
