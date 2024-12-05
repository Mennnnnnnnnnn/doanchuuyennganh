import Product from "../models/product.model.js";
export const getCartProducts = async (req,res) => {
    try {
        const products = await Product.find({_id:{$in:req.user.cartItems}});// tim tat ca san pham trong gio hang cua user hien tai
        //add quantity for each product
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product._id);// tim san pham co id tuong ung trong gio hang cua user hien tai
            return {...product.toJSON(),quantity:item.quantity};// tra ve san pham va so luong san pham trong gio hang
        });
        res.json(cartItems);

    }catch (error) {
        console.log("Error in getCartProducts controller",error.message);
        res.status(500).json({message:"server error",error: error.message});

    }
}
export const addToCart = async (req,res) => {
    try {
        const {productId} = req.body;
        const user = req.user;// ben trong middleware auth middleware

        const existingItem = user.cartItems.find(item => item.id === productId);// tim san pham co id tuong ung trong gio hang cua user hien tai
        if(existingItem){
            existingItem.quantity += 1;// tang so luong san pham trong gio hang len 1
        }else{
            user.cartItems.push(productId);// them san pham vao gio hang
        }

        await user.save();// luu thong tin gio hang cua user vao database
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in addToCart controller",error.message);
        res.status(500).json({message:"server error",error: error.message});
    }
};

export const removeAllFromCart = async (req,res) => {
try {
    const {productId} = req.body;
    const user = req.user;// ben trong middleware auth middleware
    if(!productId){
        user.cartItems = [];// xoa tat ca san pham trong gio hang
    }else{
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);// xoa san pham khoi gio hang
    }
    await user.save();// luu thong tin gio hang cua user vao database
    res.json(user.cartItems);
} catch (error) {
    res.status(500).json({message:"server error",error: error.message});
}
};
export const updateQuantity = async (req,res) => {
    try {
        const {id:productId}= req.params;// id san pham
        const {quantity} = req.body;// so luong moi
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.id === productId);// tim san pham co id tuong ung trong gio hang cua user hien tai
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);// xoa san pham khoi gio hang
                await user.save();// luu thong tin gio hang cua user vao database
                return res.json(user.cartItems);
            }
            existingItem.quantity = quantity;// cap nhat so luong san pham trong gio hang
            await user.save();// luu thong tin gio hang cua user vao database
            return res.json(user.cartItems);
        }else{
            return res.status(404).json({message:"Product not found"});
        }
    } catch (error) {
        console.log("Error in updateQuantity controller",error.message);
        res.status(500).json({message:"server error",error: error.message});
    }
};