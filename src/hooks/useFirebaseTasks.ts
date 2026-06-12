import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Task, Status, Priority } from '../types';
import { onAuthStateChanged, User } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useFirebaseTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setTasks([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    const path = `users/${user.uid}/tasks`;
    const unsubscribeTasks = onSnapshot(collection(db, path), (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
      setTasks(fetchedTasks);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribeTasks();
  }, [user]);

  const addTask = async (title: string, description: string, priority: Priority) => {
    if (!user) return;
    const docData = {
      title,
      description,
      priority,
      status: 'active' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const id = crypto.randomUUID();
    const newTask: Task = { id, ...docData };
    
    // Optimistic insert
    setTasks(prev => [newTask, ...prev]);

    const path = `users/${user.uid}/tasks/${newTask.id}`;
    try {
      await setDoc(doc(db, `users/${user.uid}/tasks`, newTask.id), docData);
    } catch (error) {
       // Rollback on fail
       setTasks(prev => prev.filter(t => t.id !== newTask.id));
       handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateTaskStatus = async (id: string, status: Status) => {
    if (!user) return;
    
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status, updatedAt: Date.now() } : t));

    const path = `users/${user.uid}/tasks/${id}`;
    try {
      await updateDoc(doc(db, `users/${user.uid}/tasks`, id), {
        status,
        updatedAt: Date.now()
      });
    } catch (error) {
       // Ideally rollback here
       handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    
    setTasks(prev => prev.filter(t => t.id !== id));

    const path = `users/${user.uid}/tasks/${id}`;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/tasks`, id));
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { tasks, user, loading, addTask, updateTaskStatus, deleteTask };
}
