// backend/controllers/nodeController.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase using environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. GET ALL NODES (For Sidebar/Graph)
exports.getAllNodes = async (req, res) => {
    const { data, error } = await supabase.from('nodes').select('*');
    
    if (error) {
        console.error("Supabase Error:", error); // This prints the REAL problem to your terminal
        return res.status(500).json(error);
    }
    
    res.json(data);
};

// 2. CREATE NEW NODE (Initial Block Save)
exports.createNode = async (req, res) => {
    const { title, folder_id, content } = req.body;
    try {
        const { data, error } = await supabase
            .from('nodes')
            .insert([{ 
                title, 
                folder_id, 
                content // This is your JSONB array of blocks
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. UPDATE NODE WITH VERSION CONTROL (The "Google Docs" Snapshot)
exports.updateNode = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        // STEP A: Fetch the content currently in the DB before overwriting
        const { data: currentNode, error: fetchError } = await supabase
            .from('nodes')
            .select('content')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        // STEP B: Create a Snapshot in node_revisions
        if (currentNode && currentNode.content) {
            const { error: revError } = await supabase
                .from('node_revisions')
                .insert([
                    { 
                        node_id: id, 
                        content_snapshot: currentNode.content,
                        snapshot_name: `Auto-save ${new Date().toLocaleString()}`
                    }
                ]);
            if (revError) console.error("Revision failed to save:", revError.message);
        }

        // STEP C: Update the main node with new blocks
        const { data, error: updateError } = await supabase
            .from('nodes')
            .update({ 
                title, 
                content, 
                updated_at: new Date() 
            })
            .eq('id', id)
            .select();

        if (updateError) throw updateError;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};