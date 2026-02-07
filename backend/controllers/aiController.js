const { GoogleGenAI } = require('@google/genai');

const safeMapSuggest = (description) => {
    if (!description) return '';
    const s = description.toLowerCase();
    const rules = [
        ["food", "Food"],
        ["restaurant", "Food"],
        ["grocery", "Groceries"],
        ["groceries", "Groceries"],
        ["supermarket", "Groceries"],
        ["bus", "Transport"],
        ["train", "Transport"],
        ["uber", "Transport"],
        ["petrol", "Petrol"],
        ["gas", "Petrol"],
        ["rent", "Rent"],
        ["salary", "Salary"],
        ["payroll", "Salary"],
        ["electric", "Utilities"],
        ["water", "Utilities"],
        ["netflix", "Entertainment"],
        ["movie", "Entertainment"],
        ["doctor", "Health"],
        ["pharmacy", "Health"],
        ["misc", "Miscellaneous"],
    ];

    for (const [kw, cat] of rules) {
        if (s.includes(kw)) return cat;
    }

    if (/[0-9]{3,}/.test(s)) return 'Utilities';
    return '';
};

exports.suggestCategory = async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) return res.status(400).json({ error: 'Description required' });

        let suggestion = '';
        if (process.env.GENAI_API_KEY) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });
                const prompt = `Choose one category from: Food, Groceries, Transport, Petrol, Utilities, Entertainment, Health, Rent, Salary, Miscellaneous.\nUser description: "${description}"\nReply with only the single category keyword.`;
                const response = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: prompt,
                });
                suggestion = response.text.trim();
            } catch (err) {
                console.error('GenAI call failed, falling back to keyword mapping:', err.message || err);
                suggestion = safeMapSuggest(description);
            }
        } else {
            suggestion = safeMapSuggest(description);
        }

        return res.json({ category: suggestion });
    } catch (err) {
        console.error('suggestCategory error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};
