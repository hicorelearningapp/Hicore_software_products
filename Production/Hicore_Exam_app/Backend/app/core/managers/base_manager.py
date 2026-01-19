class BaseManager:
    async def create(self, data: dict):
        raise NotImplementedError

    async def read_all(self):
        raise NotImplementedError

    async def read_one(self, id: int):
        raise NotImplementedError

    async def update(self, id: int, data: dict):
        raise NotImplementedError

    async def delete(self, id: int):
        raise NotImplementedError
