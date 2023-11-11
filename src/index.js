import ForgeUI, {
    IssuePanel,
    render,
    Fragment,
    Text,
    Button,
    useState,
    useProductContext,
    useConfig,
    ProjectPage
} from "@forge/ui";
import api, { route } from "@forge/api";
import { fetch } from '@forge/api';
import { storage } from "@forge/api";
// import { useEffect } from "react";
// import { useIssueProperty } from "@forge/ui-jira";
// import { useIssueKey } from "@forge/ui-jira";
// import { useProductContext } from '@forge/ui';


const fetchNumberOfIssues = async () => {
    const response = await api.asApp().requestJira(route`/rest/api/3/search`);
    const body = await response.json();
    return body.total;
}

const App = () => {
    return (
        <Fragment>
            <Text>Hello world!</Text>
        </Fragment>
    );
}

export const appPage = render(
    <ProjectPage>
        <App />
    </ProjectPage>
);

const Panel = () => {
    const { platformContext: { issueKey } } = useProductContext();
    const [numIssues, setNumIssues] = useState(0);

    const fetchAndSetNumIssues = async () => {
        const numberOfIssues = await fetchNumberOfIssues();
        setNumIssues(numberOfIssues);
    };

    return (
        <Fragment>
            <Text>Hey user!</Text>
            <Text>Issue key of this issue is: {issueKey}</Text>
            <Button text="Click me and nothing would happen, just console log" onClick={() => console.log('Button clicked!')} />
            <Button text="Show number of issues" onClick={fetchAndSetNumIssues} />
            {numIssues > 0 && <Text>Number of issues: {numIssues}</Text>}
        </Fragment>
    );
};

export const panel = render(
    <IssuePanel>
        <Panel />
    </IssuePanel>
);
