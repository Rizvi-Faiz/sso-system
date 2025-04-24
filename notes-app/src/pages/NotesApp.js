import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch notes when component mounts
  useEffect(() => {
    fetchNotes();
  }, [currentUser]);

  async function fetchNotes() {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const q = query(collection(db, "notes"), where("userId", "==", currentUser.userId));
      const querySnapshot = await getDocs(q);
      
      const fetchedNotes = [];
      querySnapshot.forEach((doc) => {
        fetchedNotes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    try {
      if (editId) {
        // Update existing note
        await updateDoc(doc(db, "notes", editId), {
            title,
            content,
            updatedAt: new Date().toISOString()
          });
          
          setEditId(null);
        } else {
          // Add new note
          await addDoc(collection(db, "notes"), {
            userId: currentUser.userId,
            title,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        
        // Reset form
        setTitle('');
        setContent('');
        
        // Refresh notes
        fetchNotes();
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  
    async function handleDelete(id) {
      try {
        await deleteDoc(doc(db, "notes", id));
        fetchNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  
    function handleEdit(note) {
      setTitle(note.title);
      setContent(note.content);
      setEditId(note.id);
    }
  
    function handleCancel() {
      setTitle('');
      setContent('');
      setEditId(null);
    }
  
    async function handleLogout() {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Failed to log out', error);
      }
    }
  
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Notes App</h1>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">
                  {currentUser?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                  Content
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  id="content"
                  placeholder="Note content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {editId ? 'Update Note' : 'Add Note'}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
            
            {isLoading ? (
              <p className="text-gray-600">Loading notes...</p>
            ) : notes.length === 0 ? (
              <p className="text-gray-600">No notes yet. Create one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{note.title}</h3>
                      <div>
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-gray-500 text-sm mt-4">
                      {new Date(note.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }