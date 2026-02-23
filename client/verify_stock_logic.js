import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyStockLogic() {
    try {
        console.log('1. Logging in as Admin/User...');
        let token;

        // Try Login
        try {
            console.log(`Attempting login to ${API_URL}/auth/login...`);
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'teststock@example.com',
                password: 'password123'
            }, { headers: { 'Content-Type': 'application/json' } });
            token = loginRes.data.token;
            console.log('Login successful.');
        } catch (e) {
            console.log(`Login failed (${e.response ? e.response.status : e.message}). Attempting registration...`);
            if (e.response && e.response.data) console.log('Login Error Data:', e.response.data);

            // Try Register
            try {
                console.log(`Attempting register to ${API_URL}/auth/register...`);
                const regRes = await axios.post(`${API_URL}/auth/register`, {
                    name: 'Stock Tester',
                    email: 'teststock@example.com',
                    password: 'password123'
                }, { headers: { 'Content-Type': 'application/json' } });
                token = regRes.data.token;
                console.log('Registration successful.');
            } catch (regErr) {
                console.error('Registration failed:', regErr.response ? regErr.response.status : regErr.message);
                if (regErr.response && regErr.response.data) console.log('Registration Error Data:', regErr.response.data);
                // If status is 400 and user exists, we might have failed login due to wrong password?
                // But we just tried login.
                return;
            }
        }

        if (!token) {
            console.error('Could not obtain token. Aborting.');
            return;
        }

        console.log('2. Fetching products...');
        const productsRes = await axios.get(`${API_URL}/products`);
        if (!productsRes.data || productsRes.data.length === 0) {
            console.error('No products found to test with.');
            return;
        }

        let targetProduct = productsRes.data.find(p => p.stock > 0);
        if (!targetProduct) {
            console.error('No products with stock > 0 found.');
            return;
        }
        console.log(`Target Product: ${targetProduct.title} (ID: ${targetProduct._id}), Stock: ${targetProduct.stock}`);

        const initialStock = Number(targetProduct.stock);
        const buyQuantity = 1;

        console.log(`3. Placing order for 1 unit...`);
        const orderData = {
            orderItems: [{
                product: targetProduct._id,
                title: targetProduct.title,
                quantity: buyQuantity,
                image: targetProduct.images[0] || '',
                price: targetProduct.price
            }],
            shippingAddress: { address: "Test St", city: "Test City", postalCode: "12345", country: "Test Country" },
            totalPrice: targetProduct.price
        };

        const config = { headers: { 'x-auth-token': token } };
        const orderRes = await axios.post(`${API_URL}/orders`, orderData, config);
        console.log('Order placed:', orderRes.status);

        console.log('4. Verifying stock decrement...');
        const verifyRes = await axios.get(`${API_URL}/products/${targetProduct._id}`);
        const finalStock = Number(verifyRes.data.stock);

        console.log(`Initial: ${initialStock}`);
        console.log(`Final:   ${finalStock}`);

        if (finalStock === initialStock - buyQuantity) {
            console.log('SUCCESS: Stock decremented correctly!');
        } else {
            console.error('FAILURE: Stock did not decrement correctly.');
        }

    } catch (err) {
        console.error('Global Error:', err.message);
        if (err.response) {
            console.log('Status:', err.response.status);
            console.log('Data:', err.response.data);
        }
    }
}

verifyStockLogic();
