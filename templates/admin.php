<?php script($_['appId'], ['../build/main']); ?>
<?php style($_['appId'], ['../build/main']); ?>
<?php style($_['appId'], ['app']); ?>
<div id="ehr-admin-settings" data-settings="<?php p(json_encode($_['settings'], true)); ?>"></div>
