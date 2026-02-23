import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testWishlist() {
    try {
        const timestamp = Date.now();
        const email = `testuser_${timestamp}@example.com`;
        const password = 'password123';

        console.log(`1. Registering new user: ${email}`);
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: email,
            password: password,
            phone: '1234567890'
        });
        const token = registerRes.data.token;
        console.log('Registration successful. Token obtained.');

        console.log('2. Fetching products...');
        const productsRes = await axios.get(`${API_URL}/products`);
        if (productsRes.data.length === 0) {
            console.log('No products found. Cannot test wishlist.');
            return;
        }
        const productId = productsRes.data[0]._id;
        console.log(`Product found: ${productId}`);

        console.log('3. Adding to wishlist...');
        const addRes = await axios.post(`${API_URL}/user/wishlist/${productId}`, {}, {
            headers: { 'x-auth-token': token }
        });
        console.log('Add to wishlist response:', addRes.status);

        // Response data is the updated wishlist array
        let wishlist = addRes.data;
        let isInWishlist = wishlist.some(id => id === productId || (id._id === productId));
        // The backend returns user.wishlist, which might be populated or not. 
        // Looking at route: router.get populates, but router.post returns user.wishlist (not populated typically unless configured).
        // Route code: user.wishlist.push(productId); res.json(user.wishlist); 
        // So it returns array of IDs.

        console.log(`Item in wishlist (from add response): ${isInWishlist}`);

        console.log('4. Verifying wishlist via GET...');
        const wishlistRes = await axios.get(`${API_URL}/user/wishlist`, {
            headers: { 'x-auth-token': token }
        });
        // GET route populates wishlist
        wishlist = wishlistRes.data;
        isInWishlist = wishlist.some(p => p._id === productId);
        console.log(`Item in wishlist (from GET response): ${isInWishlist}`);

        if (isInWishlist) {
            console.log('SUCCESS: Wishlist functionality is working on backend.');

            // Clean up
            console.log('5. Removing from wishlist...');
            await axios.post(`${API_URL}/user/wishlist/${productId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            console.log('Removed from wishlist.');
        } else {
            console.log('FAILURE: Item not found in wishlist after adding.');
        }

    } catch (error) {
        console.error('Error during test:', error.response ? error.response.data : error.message);
    }
}

testWishlist();
