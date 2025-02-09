# Django Vite

Integration of [ViteJS](https://vitejs.dev/) in a Django project.

## Installation

### Django

```
pip install django-vite
```

Add `django_vite` to your `INSTALLED_APPS` in your `settings.py`
(before your apps that are using it).

```python
INSTALLED_APPS = [
    ...
    'django_vite',
    ...
]
```

### ViteJS

Follow instructions on [https://vitejs.dev/guide/](https://vitejs.dev/guide/).
And mostly the SSR part.

Then in your ViteJS config file :

- Set the `root` options the same as your `STATIC_URL` Django setting.
- Set the `build.outDir` path to where you want the assets to compiled.
- Set the `build.manifest` options to `true`.
- As you are in SSR and not in SPA, you don't have an `index.html` that
  ViteJS can use to determine which files to compile. You need to tell it
  directly. In your ViteJS config file add the following :

```javascript
export default defineConfig({
  build {
    ...
    rollupOptions: {
      input: {
        <unique key>: '<path to your asset>'
      }
    }
  }
}
```

## Usage

### Configuration

- Define a setting variable in your `settings.py` named `DJANGO_VITE_ASSETS_PATH`
  containing the absolute path to where your assets are built.

  - This must correspond to your `build.outDir` in your ViteJS configuration.
  - The `DJANGO_VITE_ASSETS_PATH` must be included in your `STATICFILES_DIRS`
    Django setting.

- Define a setting variable in your `settings.py` named `DJANGO_VITE_DEV_MODE`
  containing a boolean defining if you want to include assets in development
  mode or production mode.

  - In development mode, assets are included as modules using the ViteJS
    webserver. This will enable HMR for your assets.
  - In production mode, assets are included as standard assets
    (no ViteJS webserver and HMR) like default Django static files.
    This means that your assets must be compiled with ViteJS before.
  - This setting may be set as the same value as your `DEBUG` setting in
    Django. But you can do what is good for yout needs.

### Template tags

Include this in your base HTML template file.

```
{% load django_vite %}
```

Then in your `<head>` element add this :

```
{% vite_hmr_client %}
```

- This will add a `<script>` tag to include the ViteJS HMR client.
- This tag will include this script only if `DJANGO_VITE_DEV_MODE` is true,
  otherwise this will do nothing.

Then add this tag to load your scripts :

```
{% vite_asset '<path to your asset>' %}
```

This will add a `<script>` tag including your JS/TS script :

- In development mode, all scripts are included as modules.
- In development mode, all scripts are marked as `async` and `defer`.
- You can pass a second argument to this tag to overrides attributes
  passed to the script tag.
- This tag only accept JS/TS, for other type of assets, they must be
  included in the script itself using `import` statements.
- In production mode, the library will read the `manifest.json` file
  generated by ViteJS and import all CSS files dependent of this script
  (before importing the script).
- You can add as many of this tag as you want, for each input you specify
  in your ViteJS configuration file.
- The path must be relative to your `root` key inside your ViteJS config file.
- The path must be a key inside your manifest file `manifest.json` file
  generated by ViteJS.
- In general, this path does not require a `/` at the beginning
  (follow your `manifest.json` file).

```
{% vite_asset_url '<path to your asset>' %}
```

This will generate only the URL to an asset with no tag surrounding it.
**Warning, this does not generate URLs for dependant assets of this one
like the previous tag.**

## Miscellaneous configuration

You can redefine those variables in your `settings.py` :

- `DJANGO_VITE_DEV_SERVER_PROTOCOL` : ViteJS webserver protocol
  (default : `http`).
- `DJANGO_VITE_DEV_SERVER_HOST` : ViteJS webserver hostname
  (default : `localhost`).
- `DJANGO_VITE_DEV_SERVER_PORT` : ViteJS webserver port
  (default : `3000`)
- `DJANGO_VITE_WS_CLIENT_URL` : ViteJS webserver path to the HMR client used
  in the `vite_hmr_client` tag (default : `@vite/client`).
- `DJANGO_VITE_MANIFEST_PATH` : Absolute path (including filename)
  to your ViteJS manifest file. This file is generated in your
  `DJANGO_VITE_ASSETS_PATH`. But if you are in production (`DEBUG` is true)
  then it is in your `STATIC_ROOT` after you collected your
  [static files](https://docs.djangoproject.com/en/3.1/howto/static-files/).

## Notes

- In production mode, all generated path are prefixed with the `STATIC_URL`
  setting of Django.

## Example

If you are struggling on how to setup a project using Django / ViteJS and Django Vite,
I've made an [example project here](https://github.com/MrBin99/django-vite-example).

## Thanks

Thanks to [Evan You](https://github.com/yyx990803) for the ViteJS library.
