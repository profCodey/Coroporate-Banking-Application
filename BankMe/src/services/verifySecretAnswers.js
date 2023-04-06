function verifySecretAnswers(secrets, answers) {
  if (answers.length === 0) {
    return false;
  }
  for (const answer of answers) {
    const matchingSecret = secrets.find(
      (secret) => secret.question === answer.question
    );

    if (!matchingSecret || matchingSecret.answer !== answer.answer) {
      return false;
    }
  }

  return true;
}

module.exports = verifySecretAnswers;
