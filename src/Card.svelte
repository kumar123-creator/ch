<!-- Card.svelte -->
<script>
    export let title;
    export let value;
    export let icon;
    
  </script>
  
  <div class="card">
    {#if icon}
      <div class="icon">
        <i class="fas {icon}"></i> <!-- Use Font Awesome icon class -->
      </div>
    {/if}
    <div class="title">{title}</div>
    <div class="value">{value}</div>
  </div>
  
  <style>
    .card {
      border: 1px solid #ccc;
      padding: 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .icon {
      font-size: 24px;
    }
  
    .title {
      font-weight: bold;
      margin-top: 10px;
    }
  </style>
  