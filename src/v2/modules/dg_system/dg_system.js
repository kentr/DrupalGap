angular.module('dg_system', ['drupalgap'])

// hook_menu()
.config(['$routeProvider', 'drupalgapSettings',
    function($routeProvider, drupalgapSettings) {
      $routeProvider.when('/dg', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_system_page'
      })
      .otherwise({
        redirectTo: drupalgapSettings.front
      });
  }
]);

// @TODO attach to module instead of app.
dgApp.directive("dgMain", function($compile, $injector) {
    return {
      link: function(scope, element) {

        var linkFn = $compile(dg_render(menu_execute_active_handler($compile, $injector) ));
        var content = linkFn(scope);
        element.append(content);

      }
    };
});

/**
 *
 */
function dg_system_page() {
  try {
    var user = dg_user_get();
    var salutation = t('Hello world!');
    if (user.uid) { salutation = t('Hello') + ' ' + user.name; }
    var content = {};
    content['my_widget'] = {
      markup: '<p>' + salutation + '</p>'
    };
    return content;
  }
  catch (error) { console.log('dg_system_page - ' + error); }
}

/**
 * Implements hook_block_info().
 * @return {Object}
 */
function system_block_info() {
  
  try {
    
    // Set up default blocks.
    var blocks = {
      main: { },
      messages: { },
      logo: { },
      logout: { },
      title: { },
      powered_by: { },
      help: { }
    };

    // Make additional blocks for each system menu.
    var system_menus = menu_list_system_menus();
    for (var menu_name in system_menus) {
        if (!system_menus.hasOwnProperty(menu_name)) { continue; }
        var menu = system_menus[menu_name];
        var block_delta = menu.menu_name;
        blocks[block_delta] = {
          //name: block_delta,
          //delta: block_delta,
          module: 'menu'
        };
    }

    return blocks;
    
  }
  catch (error) { console.log('system_block_info - ' + error); }
}

/**
 * Implements hook_block_view().
 * @param {String} delta
 * @return {String}
 */
function system_block_view(delta) {
  try {
    switch (delta) {
      case 'main':
        // This is the main content block, it is required to be in a theme's
        // region for the content of a page to show up (nodes, users, taxonomy,
        // comments, etc). Here we use it as an Angular directive, dgMain.
        return '<div dg-main></div>';
        break;
      default:
        return '';
        break;
    }
  }
  catch (error) { console.log('system_block_info - ' + error); }
}

