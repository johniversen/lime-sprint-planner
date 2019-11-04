import lime_admin.plugins
import yaml
import os
import sys


class RuntimeConfig(lime_admin.plugins.AdminPlugin):
    """A class to represent the plugin in Lime Administration.

    An instance has access to a `lime_application.application.Application`
    object via `self.application`.

    """

    @property
    def name(self):
        """The name of the plugin

        Note:
            The name is used as the key when persisting the config and
            also as the key for the plugin itself
        """
        return 'limepkg_uni'

    @property
    def title(self):
        """The title of the plugin
        """
        return 'uni'

    @property
    def version(self):
        """The version of the config

        Note:
            Should be incremented if
            the config format has changed. The version (if not None)
            is appended to the name when persisting the config
        """
        return None

    def get_config(self):
        """Function to retrieve a persisted config

        Note:
            If a config doesn't exist, then a default config should be
            persisted and then returned.

            If version has changed, then any existing config should be
            upgraded, persisted and then returned.

            There needs to be a really, really good reason for not returning
            a config at all.

        Returns:
            `dict`

        Raises:
            `lime_admin.plugins.NotFoundError` if the config doesn't exist.
        """

        """TODO: Ladda in config från lokal fil. Funkar detta?"""
        try:
            # with open(os.path.join(sys.path[0], 'uniconfig.yaml')) as file:
            with open("C:/src/lime-sprint-planner/limepkg-uni/limepkg_uni/config/uniconfig.yaml") as file:
                config = yaml.load(file, Loader=yaml.FullLoader)
            return config
            # return super().get_config()
        except lime_admin.plugins.NotFoundError:
            return {}

    def get_schema(self):
        """Function to retrieve a schema for the config.

        Returns:
            `dict`
        """
        return {}

    def set_config(self, config):
        """Function to persist a config.

        Note:
            The config should be validated before it's persisted.

        Args:
            config (dict): The config to be persisted.

        Raises:
            `lime_admin.plugins.ValueError` if the config is invalid.
        """
        super().set_config(config=config)


def register_config():
    """Function that is called by host when it's registering plugins

    Returns:
        :class:`Plugin`
    """
    return RuntimeConfig
