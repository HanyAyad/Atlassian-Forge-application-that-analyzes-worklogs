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
    const [numIssues] = useState(async () => await fetchNumberOfIssues());
    return (
        <Fragment>
            <Text>Number of issues: {numIssues}</Text>
        </Fragment>
    );
}

export const run = render(
    <ProjectPage>
        <App />
    </ProjectPage>
);

const Panel = () => {
    const { platformContext: { issueKey } } = useProductContext();

    return (
        <Fragment>
            <Text>Hey user!</Text>
            <Text>Issue key of this issue is: {issueKey}</Text>
            <Button text="Click me and nothing would happen, just console log" onClick={() => console.log('Button clicked!')} />
            <Button text="Click me and I will fetch the number of issues (idk how to show result yet lol!)" onClick={async () => {
                const response = await api.asApp().requestJira(route`/rest/api/3/search`);
                const body = await response.json();
                console.log(body.total);
            }} />
        </Fragment>

    );
}
export const panel = render(
    <IssuePanel>
        <Panel />
    </IssuePanel>
);
