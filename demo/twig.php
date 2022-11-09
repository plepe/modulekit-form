<?php
class CustomTwigTemplates implements \Twig\Loader\LoaderInterface {
  public function getSourceContext(string $name): Twig\Source {
    return new Twig\Source ($name, $name);
  }
  
  public function getCacheKey (string $name): string {
    return $name;
  }

  public function isFresh (string $name, int $time): bool {
    return true;
  }

  public function exists (string $name): bool {
    return true;
  }
}

$modulekit_load[] = "modulekit-form-twig";
$twigLoader = new CustomTwigTemplates();
$form_engine_twig = new \Twig\Environment($twigLoader);
?>
<script src="../node_modules/twig/twig.min.js"></script>
<script>
const form_engine_twig = Twig.twig
</script>
