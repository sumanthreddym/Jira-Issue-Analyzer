import ForgeUI, {
  render,
  Fragment,
  Text,
  Button,
  ButtonSet,
  useState,
  useProductContext,
  Image,
  useAction,
} from "@forge/ui";
import api from "@forge/api";
import Sentiment from "sentiment";

const Panel = () => {
  // Get the context issue key
  const {
    platformContext: { issueKey },
  } = useProductContext();

  // Render the UI

  const [data] = useAction(
    () => null,
    async () => await getContent(issueKey)
  );
  let text = data.fields.description;

  console.log(text);
  let sentiment = new Sentiment();
  let sentimentResult = sentiment.analyze(text);
  console.log(sentimentResult);
  let words =
    sentimentResult.score > 0
      ? sentimentResult.positive
      : sentimentResult.score < 0
      ? sentimentResult.negative
      : sentimentResult.words;
  return (
    <Fragment>
      <Fragment>
        <Text
          content={`Customer Sentiment is ***${
            sentimentResult.score > 0
              ? "Positive"
              : sentimentResult.score < 0
              ? "Unhappy"
              : "Neutral"
          }***`}
        />
        <Text
          content={`${
            sentimentResult.score > 0
              ? `Positive words identified are`
              : sentimentResult.score < 0
              ? `Negative words identified are`
              : `Neutral words identified are`
          } ***${words.join(", ")}***`}
        />

        <Image
          src={
            sentimentResult.score > 0
              ? "https://raw.githubusercontent.com/msvdpriya/intelliSchool/master/images/happy.gif?token=AFLVBIQRSDWIV6ZL33TXCXS7CXCRA"
              : sentimentResult.score < 0
              ? "https://raw.githubusercontent.com/msvdpriya/intelliSchool/master/images/unhappy.gif?token=AFLVBIQRSDWIV6ZL33TXCXS7CXCRA"
              : "https://raw.githubusercontent.com/msvdpriya/intelliSchool/master/images/neutral.gif?token=AFLVBIQRSDWIV6ZL33TXCXS7CXCRA"
          }
          alt="sentiment"
        />
      </Fragment>
    </Fragment>
  );
};

async function getContent(issueKey) {
  console.log(issueKey);
  console.log("in get content");
  const issueResponse = await api
    .asApp()
    .requestJira(`/rest/api/2/issue/${issueKey}?fields=summary,description`);
  // await checkResponse("Jira API", issueResponse);

  if (!issueResponse.ok) {
    const err = `Error while get_content with contentId ${issueKey}: ${issueResponse.status} ${issueResponse.statusText}`;
    console.error(err);
    throw new Error(err);
  }
  return await issueResponse.json();
}
// async function checkResponse(apiName, response) {
//   if (!response.ok) {
//     const message = `Error from ${apiName}: ${
//       response.status
//     } ${await response.text()}`;
//     console.error(message);
//     throw new Error(message);
//   } else if (DEBUG_LOGGING) {
//     console.debug(`Response from ${apiName}: ${await response.text()}`);
//   }
// }

export const run = render(<Panel />);
