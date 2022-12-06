<?php
register_hook('init', function () {
  form_element::$additional_checks['twig'] = function (&$errors, $param, $that) {
    global $form_engine_twig;

    if (!$form_engine_twig) {
      trigger_error("modulekit-form: twig extension not enabled", E_USER_WARNING);
      return false;
    }

    $twigData = array(
      'value' => $that->get_data(),
      'orig_value' => $that->get_orig_data(),
      'data' => $that->form_root->get_data(),
      'orig_data' => $that->form_root->get_orig_data(),
      'path' => explode('/', $that->path_name()),
    );

    $prefix = $that->form_root->options['twig_prefix'] ?? '';

    $result = $form_engine_twig->render("{$prefix}{$param[0]}", $twigData);
    if (trim($result) !== '') {
      $errors[] = $result;
    }
  };
});
