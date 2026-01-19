import importlib
import pkgutil
import logging
from fastapi import FastAPI
from app.core.services.db_service import DBService
from app.core.router_config import DISABLED_ROUTERS

logger = logging.getLogger(__name__)


def list_submodules(package_name: str):
    """Yield full module paths inside a package recursively."""
    try:
        package = importlib.import_module(package_name)
        if not hasattr(package, "__path__"):
            return
    except ModuleNotFoundError:
        logger.warning(f"Package not found: {package_name}")
        return

    for _, name, is_pkg in pkgutil.iter_modules(package.__path__):
        module_path = f"{package_name}.{name}"
        yield module_path
        if is_pkg:
            yield from list_submodules(module_path)


async def init_all_models(base="app.modules"):
    logger.info("Initializing models...")
    for module_name in list_submodules(base):
        if ".models" not in module_name:
            continue

        try:
            module = importlib.import_module(module_name)

            for attr in module.__dict__.values():
                if isinstance(attr, type) and hasattr(attr, "__tablename__"):
                    await DBService(attr).init_models()
                    logger.info(f"Model initialized: {attr.__name__}")

        except Exception as e:
            logger.error(f"Failed to load model module {module_name}: {e}")


def include_all_routers(app: FastAPI, base="app.modules"):
    logger.info("Including routers...")
    for module_name in list_submodules(base):
        if ".routers" not in module_name:
            continue

        if module_name in DISABLED_ROUTERS:
            logger.info(f"Router disabled: {module_name}")
            continue

        try:
            module = importlib.import_module(module_name)

            if hasattr(module, "router"):
                app.include_router(module.router)
                logger.info(f"Router included: {module_name}")

        except Exception as e:
            logger.error(f"Failed to include router {module_name}: {e}")


async def startup_event(app: FastAPI):
    logger.info("🚀 Starting application...")

    await init_all_models()
    include_all_routers(app)

    logger.info("🎉 Startup complete!")
