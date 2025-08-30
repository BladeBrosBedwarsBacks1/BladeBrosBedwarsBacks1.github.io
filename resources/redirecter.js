function enforceTrailingSlash() {
  var currentUrl = window.location.href;
  var currentPathname = window.location.pathname;

  var hasFileExtension = /\.[a-zA-Z0-9]+$/.test(currentPathname);

  if (currentPathname.slice(-1) !== '/' && !hasFileExtension) {
    var newUrl = currentUrl + '/';

    window.location.replace(newUrl);
  }
}

enforceTrailingSlash();
