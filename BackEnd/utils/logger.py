import logging
from flask import has_request_context, session

logger = logging.getLogger("DropHiveLogger")
logger.setLevel(logging.INFO)
logger.propagate = False

if not logger.hasHandlers():
    log_file_name = "../log/DropHive.log"
    if has_request_context() and "db.name" in session:
        log_file_name = f"../log/{session['db.name']}.log"
    file_handler = logging.FileHandler(log_file_name)
    file_handler.setLevel(logging.INFO)

    class CustomFormatter(logging.Formatter):
        def format(self, record):
            if record.levelno >= logging.ERROR:
                self._style._fmt = ('%(asctime)s - %(levelname)s - %(filename)s - %(funcName)s - [user: %(user)s] - %('
                                    'message)s')
            else:
                self._style._fmt = '%(asctime)s - %(levelname)s - [user: %(user)s] - %(message)s'
            return super().format(record)

    formatter = CustomFormatter()
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    class ContextFilter(logging.Filter):
        def filter(self, record):
            if has_request_context() and "user" in session:
                record.user = session["user"]
            else:
                record.user = "-"
            return True

    file_handler.addFilter(ContextFilter())
