// vite.config.js
import { defineConfig } from "file:///C:/Compass/OneDrive%20-%20%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E3%80%80%E3%82%B3%E3%83%B3%E3%83%91%E3%82%B9%E3%80%80/%E3%83%88%E3%83%B3%E3%83%99%E3%82%A4WEB/TonbeiProject/tonbei-web/node_modules/vite/dist/node/index.js";
import laravel from "file:///C:/Compass/OneDrive%20-%20%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E3%80%80%E3%82%B3%E3%83%B3%E3%83%91%E3%82%B9%E3%80%80/%E3%83%88%E3%83%B3%E3%83%99%E3%82%A4WEB/TonbeiProject/tonbei-web/node_modules/laravel-vite-plugin/dist/index.mjs";
import react from "file:///C:/Compass/OneDrive%20-%20%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E3%80%80%E3%82%B3%E3%83%B3%E3%83%91%E3%82%B9%E3%80%80/%E3%83%88%E3%83%B3%E3%83%99%E3%82%A4WEB/TonbeiProject/tonbei-web/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: "resources/js/app.tsx",
      refresh: true
    }),
    react()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDb21wYXNzXFxcXE9uZURyaXZlIC0gXHU2ODJBXHU1RjBGXHU0RjFBXHU3OTNFXHUzMDAwXHUzMEIzXHUzMEYzXHUzMEQxXHUzMEI5XHUzMDAwXFxcXFx1MzBDOFx1MzBGM1x1MzBEOVx1MzBBNFdFQlxcXFxUb25iZWlQcm9qZWN0XFxcXHRvbmJlaS13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXENvbXBhc3NcXFxcT25lRHJpdmUgLSBcdTY4MkFcdTVGMEZcdTRGMUFcdTc5M0VcdTMwMDBcdTMwQjNcdTMwRjNcdTMwRDFcdTMwQjlcdTMwMDBcXFxcXHUzMEM4XHUzMEYzXHUzMEQ5XHUzMEE0V0VCXFxcXFRvbmJlaVByb2plY3RcXFxcdG9uYmVpLXdlYlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovQ29tcGFzcy9PbmVEcml2ZSUyMC0lMjAlRTYlQTAlQUElRTUlQkMlOEYlRTQlQkMlOUElRTclQTQlQkUlRTMlODAlODAlRTMlODIlQjMlRTMlODMlQjMlRTMlODMlOTElRTMlODIlQjklRTMlODAlODAvJUUzJTgzJTg4JUUzJTgzJUIzJUUzJTgzJTk5JUUzJTgyJUE0V0VCL1RvbmJlaVByb2plY3QvdG9uYmVpLXdlYi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGxhcmF2ZWwgZnJvbSAnbGFyYXZlbC12aXRlLXBsdWdpbic7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgbGFyYXZlbCh7XG4gICAgICAgICAgICBpbnB1dDogJ3Jlc291cmNlcy9qcy9hcHAudHN4JyxcbiAgICAgICAgICAgIHJlZnJlc2g6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICByZWFjdCgpLFxuICAgIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcWYsU0FBUyxvQkFBb0I7QUFDbGhCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsU0FBUztBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLEVBQ1Y7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
