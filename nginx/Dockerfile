# Base on offical NGINX Alpine image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy both config files into the image
COPY ./default.conf /tmp/default.conf
COPY ./mini/default.conf /tmp/mini/default.conf
COPY ./medium/default.conf /tmp/medium/default.conf
# Set the build argument and the default value if not provided
ARG ISMINI=false
ARG ISMEDIUM=false
# Copy the appropriate configuration file based on the build argument
RUN if [ "$ISMINI" = "true" ]; then \
        cp /tmp/mini/default.conf /etc/nginx/conf.d/default.conf; \
    else \
        cp /tmp/default.conf /etc/nginx/conf.d/default.conf; \
    fi

RUN if [ "$ISMEDIUM" = "true" ]; then \
        cp /tmp/medium/default.conf /etc/nginx/conf.d/default.conf; \
    else \
        cp /tmp/default.conf /etc/nginx/conf.d/default.conf; \
    fi


#COPY ./default.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]