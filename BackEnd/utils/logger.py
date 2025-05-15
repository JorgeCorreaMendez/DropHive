import logging

logger = logging.getLogger("DropHiveLogger")
logger.setLevel(logging.INFO)
logger.propagate = False

if not logger.hasHandlers():
    file_handler = logging.FileHandler("../DropHive.log")
    file_handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(filename)s - %(message)s')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
