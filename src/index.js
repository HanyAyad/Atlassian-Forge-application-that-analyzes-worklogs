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
    return (
        <Fragment>
            <Text>Hello world!</Text>
        </Fragment>
    );
}
export const panel = render(
    <IssuePanel>
        <Panel />
    </IssuePanel>
);
