const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const admin = require('firebase-admin');
const cors = require('cors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Initialize Firebase Admin with your service account key
const serviceAccount = {
  "type": "service_account",
  "project_id": "shop-spectrum",
  "private_key_id": "aa914137c60b3aa8796353c41aea2b740a5d9155",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDrcjayIsW5NhNe\nSn13ZBo/XOKv+8+Zt/ae9lsdYeBJJZD5aZWjU9Yh5cjeNjNKRw8oCmzTusKgTS/h\n42i9aws3dDkGr507lUPO6OM1hkxKfqy9+Zau6vGZLQJ5NZLmYs7X+e8bC4oI/hy+\nRTlt/svW6aolY7NurEW4QzpdukKP6QMObIQRijJLpV5wLfYGSMN7IdOaiN9XHvyB\nffFiXcNfC8RHWunuOwibdJsNGMDjdBeWU7tb5p/wPyatv/qGa075CXMax6MOABjX\n8DdUmKiNj6vhgKaErcM6XpGHFBYk0pxDK/BmydR4rtzhGOv7vjOGrHACTW6RvGSP\n/94Jhp6tAgMBAAECggEAAcbKV9zATi30xnTcbn6wXgMG6NoHDntfXoKwXE/lP9gL\nOH6N9P4IcxgHRHn3OBvCJwSxHoXduxTqBBPRsgAxRPlZBs5jatQs/04tjLVXNQaw\nqfxMoUQ/j27SAnUfhyJ+ug12OueC4p98OwlNriFKi3QW5xJSA8dD/Whwc82Ye/p7\n6VC3jkcM+dcRErOS0lBIr4HA+6gMENnep3kg1cp7cbqOs1mvX1FDN6c0p4vXMPib\nAWeWy69/9TCgtn1qBAVX/vs3SNvfDOxAZosdx4kLPEFWoG/uisoDtnzHdBwfLnEa\nIH4iim309aGm4m/UnaVE6JEEF+pf9N1LadQndqjPpwKBgQD5uizPtTSelpZRpe9x\n4NTewpJUFvD+Vyddh/s3UlcBXRW77zmUJqIHq6gBxCC8LnnxQxc17Jk7XPt90Xrn\nWnPyJ/FKVp/BkItpmRw/nLNB+M7F/0+DUa5n4/txq05/MFJQJgWi+P+dC88NmT3+\nbF/5LUXGC2iMqmYYFnR6SUaOGwKBgQDxXDTmUi8i6AeWnefKWjP1ZT45q/U1LY7I\n/T9EVDKj30ZP1Xi1z41WZmQfwVXbY4uiTsl9RLLJbW2kqG9DnB6y2Dt70Ua7B0Pa\nlD0mwAMHK5+RW01czstT1HM0GyaBslktAMy5VbflUzDSFQKBHYjo5bxCdgEpvUYb\nOt5UDswy1wKBgDUgLCRL0lPiiTv5ZwT85Yw2LFcDQmV5OQCmywSr2aKKoPMII2Gn\nDlU/aVBm3ufpozt2IFvyZ26/iyjrBZBuJ7heUvCTmQzeqSnfzqiht2jTe3mXpNy0\n5btoPrehz+My7m/qhsxy2D4aowOrlAqqF4i03uEQ0D8MiQeaz1Csgfv9AoGBAInp\n7jBNdbG0c+GUiQYPVPE70LqTj6G7ToN6cdRRaD5LLpofmMIKvvBHwZ6DktOxpfAw\npOF3h9GhPa2AsVMoukHnXNX7Vzc3h4Y2flrODOzj+GHOkf4eDADyvIFhojcp+drF\nQjYEzPe0+YiRiMTOY5Tw8Qno8/EtvgmBMdlGO1gxAoGAAMcRXvCXmbPbFSrWSWkd\n7EBVIpgoVfY+8+qXq31NurlYlDvgPnDMEk2ewtgZgYp2M8F/i7G8+Sq6LihBuPqb\n0dHdaXkQK3uJzcs1/NeX7Lc9eO9oE8JPUPLqLlqNMDvGnsI03MzSwSKJ/SzICT6J\n1O91RdE+Bh1CeOBf/ev/HLs=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-r37ym@shop-spectrum.iam.gserviceaccount.com",
  "client_id": "116369642626810064936",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r37ym%40shop-spectrum.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Define your GraphQL schema
const typeDefs = gql`
  type User {
    user_id: String!
    username: String!
    email: String!
    password: String!
    user_address: String!
  }

  type Review {
    review_id: String!
    product_id: String!
    review: String!
  }

  type Product {
    product_id: String!
    product_name: String!
    product_price: Float!
    product_description: String!
    image: String!
    category: String!
  }

  type CartItem {
    user_id: String!
    product_id: String!
    quantity: Int!
    order_id: String
    product: Product
  }

  type Order {
    order_id: String
    user_id: String
    order_status: String
    order_address: String
    order_total: Float
  }

  type Query {
    users: [User]
    products(category: String): [Product]
    getCartItems(user_id: String!): [CartItem]
    getCartTotal(user_id: String!): Float 
    getUser(user_id: String!): User
    getOrdersByUserId(user_id: String!): [Order] 
    checkUserExistence(email: String!, username: String!): Boolean 
    getProductReviews(product_id: String!): [Review]
  }

  type Mutation {
    registerUser(
      username: String!
      email: String!
      password: String!
      user_address: String!
    ): User
    loginUser(email: String!, password: String!): String!
    addToCart(user_id: String!, product_id: String!, quantity: Int!): String
    placeOrder(
      user_id: String!,
      order_status: String!,
      order_address: String!, 
      order_total: Float!
    ): Order
    deleteCartItem(user_id: String!, product_id: String!): String
  }
`;







// Define your resolvers
const resolvers = {
  Query: {
    users: async () => {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.get();
      return snapshot.docs.map(doc => doc.data());
    },
    products: async (_, { category }) => {
      const productsRef = db.collection('products');
      let query = productsRef;
      if (category) {
        query = productsRef.where('category', '==', category);
      }
      const querySnapshot = await query.get();
      return querySnapshot.docs.map(doc => doc.data());
    },
    getCartItems: async (_, { user_id }) => {
      const cartItemsSnapshot = await db.collection('cart')
        .where('user_id', '==', user_id)
        .where('order_id', '==', null)
        .get();
      return cartItemsSnapshot.docs.map(doc => doc.data());
    },
    getCartTotal: async (_, { user_id }) => {     
      try {
        const cartItemsSnapshot = await db.collection('cart')
          .where('user_id', '==', user_id)
          .where('order_id', '==', null)
          .get();
          
        if (cartItemsSnapshot.empty) {
          return 0;
        }
        
        let cartTotal = 0;
    
        // Iterate through cart items and fetch product prices from products collection
        for (const cartItemDoc of cartItemsSnapshot.docs) {
          const cartItem = cartItemDoc.data();
          const product_id = cartItem.product_id; // Get product_id from cartItem
        
          // Query products collection using product_id
          const productDoc = await db.collection('products').doc(product_id).get();
        
          if (productDoc.exists) {
            const productPrice = productDoc.data().product_price;
        
            // Calculate cartTotal using productPrice and quantity
            cartTotal += cartItem.quantity * productPrice;
          }
        }
        return cartTotal;
      } catch (error) {
        throw new Error('Failed to fetch cart total');
      }
    },
    getUser: async (_, { user_id }) => {
      try {
          const userDoc = await db.collection('users').doc(user_id).get();
          console.log(userDoc.exists)
          if (userDoc.exists) {
              const user = userDoc.data();
              return user;
          } else {
              throw new Error('User not found');
          }
      } catch (error) {
          throw new Error('Failed to fetch user');
      }
    },
    getOrdersByUserId: async (_, { user_id }) => {
      try {
        const ordersSnapshot = await db.collection('orders')
          .where('user_id', '==', user_id)
          .get();
    
        const orders = ordersSnapshot.docs.map(orderDoc => orderDoc.data());
        return orders;
      } catch (error) {
        throw new Error('Failed to fetch orders');
      }
    },
    checkUserExistence: async (_, { email, username }) => {
      try {
        const snapshot = await db.collection('users')
          .where('email', '==', email)
          .orWhere('username', '==', username)
          .get();
        return !snapshot.empty;
      } catch (error) {
        throw new Error('Failed to check user existence');
      }
    },
    getProductReviews: async (_, { product_id }) => {
      try {
        const snapshot = await db.collection('reviews')
          .where('product_id', '==', product_id)
          .get();
        
        const reviews = snapshot.docs.map(reviewDoc => reviewDoc.data());
        return reviews;
      } catch (error) {
        throw new Error('Failed to fetch product reviews');
      }
    },
  },
  Mutation: {
    registerUser: async (_, { username, email, password, user_address }) => {
      try {
        const existingUser = await db.collection('users')
          .where('email', '==', email)
          .get();
  
        if (!existingUser.empty) {
          throw new Error('Email already registered');
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Use the provided user_id as the document ID
        const user_id = db.collection('users').doc().id; // Generate an ID
        const newUser = {
          username,
          user_id,
          email,
          password: hashedPassword,
          user_address,
        };
  
        // Explicitly set the document ID to user_id
        await db.collection('users').doc(user_id).set(newUser);
  
        return { ...newUser, user_id };
      } catch (error) {
        throw new Error('Failed to register user');
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const userQuerySnapshot = await db.collection('users')
          .where('email', '==', email.toLowerCase())
          .get();
    
        if (userQuerySnapshot.empty) {
          throw new Error('User not found');
        }
    
        const userData = userQuerySnapshot.docs[0].data();
        const passwordMatch = await bcrypt.compare(password, userData.password);
    
        if (!passwordMatch) {
          throw new Error('Invalid password');
        }
    
        // Replace 'your-secret-key' with your actual secret key
        const token = jwt.sign({ user_id: userData.user_id }, 'your-actual-secret-key', {
          expiresIn: '1h',
        });
    
        return JSON.stringify({
          token,
          user_id: userData.user_id,
          username: userData.username
        });
      } catch (error) {
        throw new Error('Failed to login');
      }
    },
    addToCart: async (_, { user_id, product_id, quantity }) => {
      try {
        const existingCartItem = await db.collection('cart')
          .where('user_id', '==', user_id)
          .where('product_id', '==', product_id)
          .where('order_id', '==', null)
          .get();
  
        if (!existingCartItem.empty) {
          // Update existing cart item
          const cartItemRef = db.collection('cart').doc(existingCartItem.docs[0].id);
          await cartItemRef.update({ quantity: existingCartItem.docs[0].data().quantity + quantity });
        } else {
          // Insert new cart item
          await db.collection('cart').add({
            user_id,
            product_id,
            quantity,
            order_id: null,
          });
        }
  
        return 'Product added to cart';
      } catch (error) {
        throw new Error('Failed to add product to cart');
      }
    },
    placeOrder: async (_, { user_id, order_status, order_address, order_total }) => {
      try {
        const orderRef = await db.collection('orders').add({
          user_id,
          order_status,
          order_address,
          order_total,
        });
  
        const order_id = orderRef.id;
  
        const cartItemsSnapshot = await db.collection('cart')
          .where('user_id', '==', user_id)
          .where('order_id', '==', null)
          .get();
  
        const cartItemUpdates = cartItemsSnapshot.docs.map(cartItemDoc => {
          return cartItemDoc.ref.update({ order_id });
        });
  
        await Promise.all(cartItemUpdates);
  
        return {
          user_id,
          order_id,
          order_status,
          order_address,
          order_total,
        };
      } catch (error) {
        throw new Error('Failed to place order');
      }
    },
    deleteCartItem: async (_, { user_id, product_id }) => {
      try {
        const cartItemsSnapshot = await db.collection('cart')
          .where('user_id', '==', user_id)
          .where('product_id', '==', product_id)
          .where('order_id', '==', null)
          .get();
  
        if (!cartItemsSnapshot.empty) {
          const cartItemRef = cartItemsSnapshot.docs[0].ref;
          await cartItemRef.delete();
          return 'Cart item deleted successfully';
        } else {
          throw new Error('Cart item not found');
        }
      } catch (error) {
        throw new Error('Failed to delete cart item');
      }
    },
  },
  CartItem: {
    product: async (parent) => {
      try {
        const productDoc = await db.collection('products').doc(parent.product_id).get();
        if (productDoc.exists) {
          return productDoc.data();
        }
        return null;
      } catch (error) {
        console.error('Error fetching product from Firestore:', error);
        throw new Error('Failed to fetch product');
      }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();

  const app = express();
  app.use(cors())
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();