function errorMessage(errors: { $message: string }[]): string {
  const error = errors[errors.length - 1];

  return error?.$message.replaceAll('_', ' ') || '';
}

export default errorMessage;
