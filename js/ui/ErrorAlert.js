export function createErrorAlert(message) {
  return $(`
    <div class="alert alert-danger text-center" role="alert">
      <h4 class="alert-heading">
        <i class="bi bi-exclamation-triangle-fill"></i> Data Loading Error
      </h4>
      <p>${message}</p>
      <hr>
      <p class="mb-0">
        Please try refreshing the page or checking your internet connection.
      </p>
    </div>
  `);
}
