const api = require('@forge/api');

exports.issueKeyResolver = async (parent, context) => {
    try {
        console.log('Context in resolver:', context);

        // Check if issueKey is directly available in the context
        const issueKey = context.issueKey;

        if (!issueKey) {
            console.error('Issue key is undefined.');
            throw new Error('Issue key is undefined.');
        }

        return issueKey;
    } catch (error) {
        console.error('Error in resolver:', error);
        throw error;
    }
};
