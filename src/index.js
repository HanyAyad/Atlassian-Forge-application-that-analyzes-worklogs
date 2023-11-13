import ForgeUI, {
    IssuePanel,
    render,
    Fragment,
    Text,
    Button,
    useState,
    useProductContext,
    ProjectPage,
    Form,
    Toggle
} from "@forge/ui";
import api, { route } from "@forge/api";
import { useEffect } from "react";


const fetchNumberOfIssues = async () => {
    const response = await api.asApp().requestJira(route`/rest/api/3/search`);
    const body = await response.json();
    return body.total;
}


const App = () => {
    const [enableIssuePanel, setEnableIssuePanel] = useState(true);
    const [enableCustomFields, setEnableCustomFields] = useState(true);

    const handleIssuePanelChange = () => {
        setEnableIssuePanel(!enableIssuePanel);
    };

    const handleCustomFieldsChange = () => {
        setEnableCustomFields(!enableCustomFields);
    };

    function handleSubmit() {
        console.log("Submit");

    }

    return (
        <Form onSubmit={handleSubmit}>
            <Toggle
                label="Enable Issue Panel"
                onChange={handleIssuePanelChange}
                checked={enableIssuePanel}
                name={"enableissue"}/>
            <Toggle
                label="Enable Custom Fields"
                onChange={handleCustomFieldsChange}
                checked={enableCustomFields}
                name={"enablecustom"}
            />
        </Form>
    );
}
export const appPage = render(
    <ProjectPage>
        <App />
    </ProjectPage>
);

const Panel = () => {
    const productContext = useProductContext();
    const issueKey = productContext?.issueKey;

    const [numIssues, setNumIssues] = useState(0);

    const fetchAndSetNumIssues = async () => {
        const numberOfIssues = await fetchNumberOfIssues();
        setNumIssues(numberOfIssues);
    };

    return (
        <Fragment>
            {true && (
            <Fragment>
            <Text>Hey user!</Text>
            {issueKey && <Text>Issue key of this issue is: {issueKey}</Text>}
            <Button text="Click me and nothing would happen, just console log" onClick={() => console.log('Button clicked!')} />
            <Button text="Show number of issues" onClick={fetchAndSetNumIssues} />
            {numIssues > 0 && <Text>Number of issues: {numIssues}</Text>}

            {/* Display and update the custom fields */}
            {issueKey && <CustomFields issueKey={issueKey} />}
            </Fragment>
                )}
        </Fragment>

    );
};


export const panel = render(
    <IssuePanel>
        <Panel />
    </IssuePanel>
);


// ...
const CustomFields = ({ issueKey }) => {
    const [loading, setLoading] = useState(true);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [priorityScore, setPriorityScore] = useState(null);

    useEffect(() => {
        fetchCustomFieldValues(issueKey);
    }, [issueKey]);

    const fetchCustomFieldValues = async (issueKey) => {
        setLoading(true);
        try {
            const [estimatedTimeValue, priorityScoreValue] = await Promise.all([
                getCustomFieldValue(issueKey, 'estimatedTimeToComplete'),
                getCustomFieldValue(issueKey, 'priorityScore'),
            ]);
            setEstimatedTime(estimatedTimeValue);
            setPriorityScore(priorityScoreValue);
        } catch (error) {
            console.error('Error fetching custom field values:', error);
            // Handle the error consistently - set an error state or show a message to the user
        } finally {
            setLoading(false);
        }
    };


    const updateEstimatedTime = async (newValue) => {
        try {
            await updateCustomField(issueKey, 'estimatedTimeToComplete', newValue);
            // Refresh the custom field values after updating
            await fetchCustomFieldValues(issueKey);
        } catch (error) {
            console.error('Error updating Estimated Time:', error);
            // Handle the error - set an error state or show a message to the user
        }
    };


    const getCustomFieldValue = async (issueKey, customFieldKey) => {
        try {
            const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
            const issueDetails = await response.json();
            return issueDetails.fields[customFieldKey];
        } catch (error) {
            console.error('Error fetching custom field value:', error);
            throw error;
        }
    };

// Function to update the value of a custom field for a specific issue
    const updateCustomField = async (issueKey, customFieldKey, newValue) => {
        try {
            const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fields: {
                        [customFieldKey]: newValue,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update custom field: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating custom field:', error);
            // Handle the error consistently - set an error state or show a message to the user
        }
    };

    // Similar logic for updating Priority Score

    return (
        <Fragment>
            <Text>Estimated Time to Complete: {estimatedTime}</Text>
            <Button text={loading ? 'Updating...' : 'Update Estimated Time'} onClick={() => updateEstimatedTime(/* provide new value */)} />


            <Text>Priority Score: {priorityScore}</Text>
            {/* Add a button and logic for updating Priority Score */}
        </Fragment>
    );
};

// ...


