<?php script($_['appId'], ['../build/main']); ?>
<?php style($_['appId'], ['../build/main']); ?>
<?php style($_['appId'], ['app']); ?>
<div id="ehr-root" data-app="<?php p(json_encode($_['data'], true)); ?>" style="width: 100%;"></div>
