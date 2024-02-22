export const handler = async (event) => {
  console.log("event:", JSON.stringify(event, undefined, 2));

  const response = {
    statusCode: 200,
    body: JSON.stringify('Notification Lambda received the '),
  };
  return response;
};
