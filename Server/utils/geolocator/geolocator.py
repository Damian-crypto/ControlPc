import asyncio
import winsdk.windows.devices.geolocation as wdg


class GeoLocationManager:

    @classmethod
    async def get_coordinates(cls):
        locator = wdg.Geolocator()
        pos = await locator.get_geoposition_async()
        return [pos.coordinate.latitude, pos.coordinate.longitude]

    @classmethod
    def get_geolocation(cls):
        try:
            return asyncio.run(cls.get_coordinates())
        except PermissionError:
            print("ERROR: You need to allow applications to access you location in Windows settings")
