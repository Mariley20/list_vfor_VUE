import db from '@/firebase/init'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'

export const SouthernApp = {
  getLicitacion: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'licitacion'))
      const data = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data.push({ id: doc.id, ...doc.data() })
      })
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  createLicitacion: async ({ data }) => {
    try {
      const docRef = await addDoc(collection(db, 'licitacion'), data)

      return docRef.id
    } catch (e) {
      throw new Error(e)
    }
  },
  deleteLicitacionById: async ({ licitacionId }) => {
    try {
      const docRef = await deleteDoc(doc(db, 'licitacion', licitacionId))

      return docRef
    } catch (e) {
      throw new Error(e)
    }
  },
  getLicitacionDetails: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'licitacion-details'))
      const data = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data.push({ id: doc.id, ...doc.data() })
      })
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  createDetalleLicitacion: async ({ data }) => {
    try {
      const docRef = await addDoc(collection(db, 'licitacion-details'), data)

      return docRef.id
    } catch (e) {
      throw new Error(e)
    }
  },
  deleteLicitacionDetailById: async ({ detailLicitacionId }) => {
    try {
      const docRef = await deleteDoc(doc(db, 'licitacion-details', detailLicitacionId))

      return docRef
    } catch (e) {
      throw new Error(e)
    }
  },
  getCompanies: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'companies'))
      const data = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data.push({ id: doc.id, ...doc.data() })
      })
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  createCompany: async ({ data }) => {
    try {
      const docRef = await addDoc(collection(db, 'companies'), data)

      return docRef.id
    } catch (e) {
      throw new Error(e)
    }
  },
  deleteCompanyById: async ({ companyId }) => {
    try {
      const docRef = await deleteDoc(doc(db, 'companies', companyId))

      return docRef
    } catch (e) {
      throw new Error(e)
    }
  },
  getProducts: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const data = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data.push({ id: doc.id, ...doc.data() })
      })
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  createProduct: async ({ data }) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), data)

      return docRef.id
    } catch (e) {
      throw new Error(e)
    }
  },
  deleteProductById: async ({ productId }) => {
    try {
      const docRef = await deleteDoc(doc(db, 'products', productId))

      return docRef
    } catch (e) {
      throw new Error(e)
    }
  }
}
