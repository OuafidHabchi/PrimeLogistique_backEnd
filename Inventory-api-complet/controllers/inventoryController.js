// GET all items
exports.getAllItems = async (req, res) => {
    try {
        const InventoryItem = req.connection.models.InventoryItem; // Modèle injecté dynamiquement
        const items = await InventoryItem.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET an item by ID
exports.getItemById = async (req, res) => {
    try {
        const InventoryItem = req.connection.models.InventoryItem; // Modèle injecté dynamiquement
        const item = await InventoryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE multiple items
exports.createItems = async (req, res) => {
    try {
        const InventoryItem = req.connection.models.InventoryItem; // Modèle injecté dynamiquement
        // Normalisation des valeurs de type
        const normalizedItems = req.body.map(item => ({
            ...item,
            type: item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase() // Capitalize the first letter
        }));

        // console.log('Normalized data:', normalizedItems);

        const items = await InventoryItem.insertMany(normalizedItems);
        res.status(201).json({ message: "Items created successfully", items });
    } catch (err) {
        console.error("Error during insertMany:", err.message);
        res.status(400).json({ error: err.message });
    }
};



// UPDATE multiple items
exports.updateItems = async (req, res) => {
    try {
        const InventoryItem = req.connection.models.InventoryItem; // Modèle injecté dynamiquement
        // Normalize the input data
        const normalizedUpdates = req.body.map(item => ({
            ...item,
            type: item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase() // Capitalize the first letter
        }));

        // Perform updates
        const updatedItems = await Promise.all(
            normalizedUpdates.map(async (item) => {
                // Update only the fields provided
                const updated = await InventoryItem.findByIdAndUpdate(
                    item.id,
                    { $set: item },
                    { new: true } // Return the updated document
                );
                if (!updated) throw new Error(`Item with ID ${item.id} not found`);
                return updated;
            })
        );

        res.status(200).json({ message: "Items updated successfully", updatedItems });
    } catch (err) {
        console.error("Error updating items:", err.message);
        res.status(400).json({ error: err.message });
    }
};



// DELETE all items
exports.clearAllItems = async (req, res) => {
    try {
        const InventoryItem = req.connection.models.InventoryItem; // Modèle injecté dynamiquement
        const result = await InventoryItem.deleteMany({});
        res.status(200).json({ message: `All items deleted successfully. Total deleted: ${result.deletedCount}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
